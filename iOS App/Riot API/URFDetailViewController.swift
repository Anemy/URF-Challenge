//
//  URFDetailViewController.swift
//  Riot API
//
//  Created by George Lo on 4/16/15.
//  Copyright (c) 2015 George & Rhys. All rights reserved.
//

import UIKit

class URFDetailViewController: UITableViewController {
    
    var champion: Champion?
    
    let sectionTitles = ["Champion", "General / Average", "Total"]
    let rowTitles = [
        ["ID"],
        ["Assists", "CS", "Deaths", "Gold", "KDA", "Kills", "WinRate"],
        ["CS", "Deaths", "Gold", "Kills", "Losses", "Plays", "Wins"]]

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationItem.title = champion!.champName
        
        let imageIcon = PASImageView(frame: CGRectMake((UIScreen.mainScreen().bounds.width - 115) / 2, 15, 115, 115))
        self.tableView.tableHeaderView = UIView(frame: CGRectMake(0, 0, UIScreen.mainScreen().bounds.width, 130))
        self.tableView.tableHeaderView!.addSubview(imageIcon)
        
        let championURLName = (champion!.champName as NSString).stringByReplacingOccurrencesOfString(" ", withString: "").stringByReplacingOccurrencesOfString("'", withString: "")
        imageIcon.imageURL(NSURL(string: "http://ddragon.leagueoflegends.com/cdn/5.7.2/img/champion/\(championURLName).png")!)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        // Return the number of sections.
        return sectionTitles.count
    }
    
    override func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return sectionTitles[section]
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // Return the number of rows in the section.
        return rowTitles[section].count
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("URF Detail Cell", forIndexPath: indexPath) as! UITableViewCell
        
        cell.textLabel!.text = rowTitles[indexPath.section][indexPath.row]
        if indexPath.section == 0 {
            if indexPath.row == 0 {
                cell.detailTextLabel!.text = "\(champion!.champID)"
            }
        } else if indexPath.section == 1 {
            if indexPath.row == 0 {
                cell.detailTextLabel!.text = "\(round(champion!.averageAssists * 100) / 100)"
            } else if indexPath.row == 1 {
                cell.detailTextLabel!.text = "\(round(champion!.averageCS * 100) / 100)"
            } else if indexPath.row == 2 {
                cell.detailTextLabel!.text = "\(round(champion!.averageDeaths * 100) / 100)"
            } else if indexPath.row == 3 {
                cell.detailTextLabel!.text = "\(round(champion!.averageGold * 100) / 100)"
            } else if indexPath.row == 4 {
                cell.detailTextLabel!.text = "\(round((champion!.averageKills + champion!.averageAssists) / champion!.averageDeaths * 100) / 100)"
            } else if indexPath.row == 5 {
                cell.detailTextLabel!.text = "\(round(champion!.averageKills * 100) / 100)"
            } else if indexPath.row == 6 {
                cell.detailTextLabel!.text = "\(round(champion!.winRate * 10000) / 100)%"
            }
        } else if indexPath.section == 2 {
            if indexPath.row == 0 {
                cell.detailTextLabel!.text = "\(champion!.cs)"
            } else if indexPath.row == 1 {
                cell.detailTextLabel!.text = "\(champion!.deaths)"
            } else if indexPath.row == 2 {
                cell.detailTextLabel!.text = "\(champion!.gold)"
            } else if indexPath.row == 3 {
                cell.detailTextLabel!.text = "\(champion!.kills)"
            } else if indexPath.row == 4 {
                cell.detailTextLabel!.text = "\(champion!.totalLosses)"
            } else if indexPath.row == 5 {
                cell.detailTextLabel!.text = "\(champion!.totalPlays)"
            } else if indexPath.row == 6 {
                cell.detailTextLabel!.text = "\(champion!.totalWins)"
            }
        }

        return cell
    }

    // MARK: - Table view delegate
    
    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }

}
