//
//  URFViewController.swift
//  Riot API
//
//  Created by George Lo on 4/14/15.
//  Copyright (c) 2015 George & Rhys. All rights reserved.
//

import UIKit

class URFViewController: UITableViewController {
    
    var champions: [Champion] = []

    override func viewDidLoad() {
        super.viewDidLoad()

        request(.GET, "http://vowb.net:4000/URFData").responseJSON { (_, _, JSON, error) in
            if error != nil {
                // Get cached data
                self.champions = Champion.loadChampions()
            } else if let championArray = (JSON as! NSDictionary)["champions"] as? NSArray {
                for championObject in championArray {
                    // ChampionObject can be null or a dictionary
                    if let champion = championObject as? NSDictionary {
                        let currentChampion = Champion(averageAssists: champion["averageAssists"]!.doubleValue, averageCS: champion["averageCS"]!.doubleValue, averageDeaths: champion["averageDeaths"]!.doubleValue, averageGold: champion["averageGold"]!.doubleValue, averageKills: champion["averageKills"]!.doubleValue, champID: champion["champID"]!.integerValue, champName: champion["champName"] as! String, cs: champion["cs"]!.integerValue, deaths: champion["deaths"]!.integerValue, gold: champion["gold"]!.integerValue, kda: champion["kda"]!.doubleValue, kills: champion["kills"]!.integerValue, totalLosses: champion["totalLosses"]!.integerValue, totalPlays: champion["totalPlays"]!.integerValue, totalWins: champion["totalWins"]!.integerValue, winRate: champion["winRate"]!.doubleValue)
                        self.champions.append(currentChampion)
                    }
                }
                Champion.saveChampions(self.champions)
            }
            self.tableView.reloadSections(NSIndexSet(index: 0), withRowAnimation: UITableViewRowAnimation.Automatic)
        }
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
        return champions.count
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("URF Cell", forIndexPath: indexPath) as! URFTableViewCell
        
        let championURLName = (champions[indexPath.row].champName as NSString).stringByReplacingOccurrencesOfString(" ", withString: "").stringByReplacingOccurrencesOfString("'", withString: "")
        cell.imageIcon.imageURL(NSURL(string: "http://ddragon.leagueoflegends.com/cdn/5.7.2/img/champion/\(championURLName).png")!)
        cell.nameLabel.text = champions[indexPath.row].champName
        cell.winRateLabel.text = "\(round(champions[indexPath.row].winRate * 1000)/10)%"
        cell.playsLabel.text = "\(champions[indexPath.row].totalPlays)"
        cell.kdaLabel.text = "\(round((champions[indexPath.row].averageKills + champions[indexPath.row].averageAssists) / champions[indexPath.row].averageDeaths * 100) / 100)"
        cell.csLabel.text = "\(round(champions[indexPath.row].averageCS * 100) / 100)"
        cell.goldLabel.text = "\(round(champions[indexPath.row].averageGold * 100) / 100)"
        
        return cell
    }
    
    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }

}
