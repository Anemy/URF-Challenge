//
//  URFViewController.swift
//  Riot API
//
//  Created by George Lo on 4/14/15.
//  Copyright (c) 2015 George & Rhys. All rights reserved.
//

import UIKit

class URFViewController: UITableViewController, UISearchBarDelegate, UIActionSheetDelegate {
    
    var allChampions: [Champion] = []
    var resChampions: [Champion] = []
    var sortOptions = -1
    var selectedRow = -1
    
    @IBOutlet weak var searchBar: UISearchBar!
    
    @IBAction func searchButtonPressed(sender: AnyObject) {
        self.searchBar.becomeFirstResponder()
    }
    
    @IBAction func filterButtonPressed(sender: AnyObject) {
        UIActionSheet(title: "Sort By", delegate: self, cancelButtonTitle: "Cancel", destructiveButtonTitle: nil, otherButtonTitles: "Name", "Win Rate", "Games Played", "KDA", "Average CS", "Average Gold").showFromBarButtonItem(self.navigationItem.leftBarButtonItem, animated: true)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.refreshControl = UIRefreshControl()
        self.refreshControl?.tintColor = UIColor(red: 0.812, green: 0.729, blue: 0.42, alpha: 1)
        self.refreshControl?.addTarget(self, action: "refreshURFData", forControlEvents: UIControlEvents.ValueChanged)
        
        self.searchBar.delegate = self

        refreshURFData()
    }
    
    func refreshURFData() {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = true
        request(.GET, "http://vowb.net:4000/URFData").responseJSON { (_, _, JSON, error) in
            if error != nil {
                // Get cached data
                self.allChampions = Champion.loadChampions()
                UIAlertView(title: "We Apologize", message: "An error has occurred. Please make sure you have a stable network connection, then try refreshing by pulling up the table view.", delegate: nil, cancelButtonTitle: "OK").show()
            } else if let championArray = (JSON as! NSDictionary)["champions"] as? NSArray {
                self.allChampions.removeAll(keepCapacity: true)
                for championObject in championArray {
                    // ChampionObject can be null or a dictionary
                    if let champion = championObject as? NSDictionary {
                        let currentChampion = Champion(averageAssists: champion["averageAssists"]!.doubleValue, averageCS: champion["averageCS"]!.doubleValue, averageDeaths: champion["averageDeaths"]!.doubleValue, averageGold: champion["averageGold"]!.doubleValue, averageKills: champion["averageKills"]!.doubleValue, champID: champion["champID"]!.integerValue, champName: champion["champName"] as! String, cs: champion["cs"]!.integerValue, deaths: champion["deaths"]!.integerValue, gold: champion["gold"]!.integerValue, kda: champion["kda"]!.doubleValue, kills: champion["kills"]!.integerValue, totalLosses: champion["totalLosses"]!.integerValue, totalPlays: champion["totalPlays"]!.integerValue, totalWins: champion["totalWins"]!.integerValue, winRate: champion["winRate"]!.doubleValue)
                        self.allChampions.append(currentChampion)
                    }
                }
                Champion.saveChampions(self.allChampions)
            }
            self.resChampions = self.allChampions
            if self.sortOptions > -1 {
                self.sortChampions()
            }
            
            self.tableView.reloadSections(NSIndexSet(index: 0), withRowAnimation: UITableViewRowAnimation.Top)
            self.refreshControl?.endRefreshing()
            UIApplication.sharedApplication().networkActivityIndicatorVisible = false
        }
    }
    
    func sortChampions() {
        if sortOptions == 0 {
            allChampions.sort({ $0.champName < $1.champName })
            resChampions.sort({ $0.champName < $1.champName })
        } else if sortOptions == 1 {
            allChampions.sort({ $0.winRate > $1.winRate })
            resChampions.sort({ $0.winRate > $1.winRate })
        } else if sortOptions == 2 {
            allChampions.sort({ $0.totalPlays > $1.totalPlays })
            resChampions.sort({ $0.totalPlays > $1.totalPlays })
        } else if sortOptions == 3 {
            allChampions.sort({ $0.averageCS > $1.averageCS })
            resChampions.sort({ $0.averageCS > $1.averageCS })
        } else if sortOptions == 4 {
            allChampions.sort({ ($0.averageKills + $0.averageAssists) / $0.averageDeaths > ($1.averageKills + $1.averageAssists) / $1.averageDeaths })
            resChampions.sort({ ($0.averageKills + $0.averageAssists) / $0.averageDeaths > ($1.averageKills + $1.averageAssists) / $1.averageDeaths })
        } else if sortOptions == 5 {
            allChampions.sort({ $0.averageGold > $1.averageGold })
            resChampions.sort({ $0.averageGold > $1.averageGold })
        }
        self.tableView.reloadSections(NSIndexSet(index: 0), withRowAnimation: UITableViewRowAnimation.Top)
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        let detailViewController = segue.destinationViewController as! URFDetailViewController
        detailViewController.champion = resChampions[selectedRow]
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        // Return the number of sections.
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // Return the number of rows in the section.
        return resChampions.count
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("URF Cell", forIndexPath: indexPath) as! URFTableViewCell
        
        let championURLName = (resChampions[indexPath.row].champName as NSString).stringByReplacingOccurrencesOfString(" ", withString: "").stringByReplacingOccurrencesOfString("'", withString: "")
        cell.imageIcon.imageURL(NSURL(string: "http://ddragon.leagueoflegends.com/cdn/5.7.2/img/champion/\(championURLName).png")!)
        cell.nameLabel.text = resChampions[indexPath.row].champName
        cell.winRateLabel.text = "\(round(resChampions[indexPath.row].winRate * 1000)/10)%"
        cell.playsLabel.text = "\(resChampions[indexPath.row].totalPlays)"
        cell.kdaLabel.text = "\(round((resChampions[indexPath.row].averageKills + resChampions[indexPath.row].averageAssists) / resChampions[indexPath.row].averageDeaths * 100) / 100)"
        cell.csLabel.text = "\(round(resChampions[indexPath.row].averageCS * 100) / 100)"
        cell.goldLabel.text = "\(round(resChampions[indexPath.row].averageGold * 100) / 100)"
        
        cell.accessoryType = UITableViewCellAccessoryType.DisclosureIndicator
        
        return cell
    }
    
    // MARK: - Table view delegate
    
    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        selectedRow = indexPath.row
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
        self.performSegueWithIdentifier("toURFDetail", sender: self)
    }
    
    // MARK: - Search bar delegate
    
    func searchBarTextDidBeginEditing(searchBar: UISearchBar) {
        searchBar.setShowsCancelButton(true, animated: true)
    }
    
    func searchBarTextDidEndEditing(searchBar: UISearchBar) {
        searchBar.setShowsCancelButton(false, animated: true)
    }
    
    func searchBarCancelButtonClicked(searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
    }
    
    func searchBar(searchBar: UISearchBar, textDidChange searchText: String) {
        if count(searchText) == 0 && resChampions.count == allChampions.count {
            return
        }
        
        if count(searchText) == 0 {
            resChampions = allChampions
        } else {
            resChampions = allChampions.filter() {
                return ($0 as Champion).champName.rangeOfString(searchText) != nil
            }
        }
        self.tableView.reloadSections(NSIndexSet(index: 0), withRowAnimation: UITableViewRowAnimation.Automatic)
    }
    
    func searchBarSearchButtonClicked(searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
    }
    
    // MARK: - Action sheet delegate
    
    func actionSheet(actionSheet: UIActionSheet, clickedButtonAtIndex buttonIndex: Int) {
        if buttonIndex > 0 {
            sortOptions = buttonIndex - 1
            sortChampions()
        }
    }

}
