//
//  InformationViewController.swift
//  Riot API
//
//  Created by George Lo on 4/14/15.
//  Copyright (c) 2015 George & Rhys. All rights reserved.
//

import UIKit

class InformationViewController: UITableViewController {
    
    let sectionTitles = ["Getting Started", "Champions and Items", "Customize your Summoner", "Game Modes"]
    let rowTitles = [
        ["New Player Guide", "Become a Summoner", "Interact with Players", "Chat Commands"],
        ["Full Champion Lineup", "The Arsenal of Items"],
        ["Powerful Summoner Spells", "Boost stats with Runes", "Enhance champions with Masteries"],
        ["Summoner's Rift", "The Twisted Treeline", "Howling Abyss", "The Crystal Scar"]]
    let urls = [
           ["http://gameinfo.na.leagueoflegends.com/en/game-info/get-started/new-player-guide/",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/summoners/",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/get-started/community-interaction/",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/get-started/chat-commands/"],
           ["http://gameinfo.na.leagueoflegends.com/en/game-info/champions/",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/items/"],
           ["http://gameinfo.na.leagueoflegends.com/en/game-info/summoners/spells/",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/summoners/runes/",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/summoners/masteries/"],
           ["http://gameinfo.na.leagueoflegends.com/en/game-info/game-modes/summoners-rift/",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/game-modes/the-twisted-treeline/",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/game-modes/howling-abyss",
            "http://gameinfo.na.leagueoflegends.com/en/game-info/game-modes/the-crystal-scar"]]
    
    var selectedUrl: String?
    var selectedTitle: String?

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        let detailViewController = segue.destinationViewController as! InformationDetailViewController
        detailViewController.navigationItem.title = selectedTitle
        detailViewController.url = NSURL(string: selectedUrl!)
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        // Return the number of sections.
        return sectionTitles.count
    }
    
    override func tableView(tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let view = UIView(frame: CGRectMake(0, 0, UIScreen.mainScreen().bounds.width, 30))
        let label = UILabel(frame: CGRectMake(17, 0, view.frame.width - 30, 30))
        label.font = UIFont.boldSystemFontOfSize(17)
        label.text = sectionTitles[section]
        view.addSubview(label)
        view.backgroundColor = UIColor(white: 0.95, alpha: 1)
        return view
    }
    
    override func tableView(tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 30
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // Return the number of rows in the section.
        return rowTitles[section].count
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Information Cell", forIndexPath: indexPath) as! UITableViewCell

        cell.imageView?.image = UIImage(named: rowTitles[indexPath.section][indexPath.row])
        cell.textLabel?.text = rowTitles[indexPath.section][indexPath.row]
        
        cell.imageView?.layer.cornerRadius = 15
        cell.imageView?.layer.masksToBounds = true

        return cell
    }
    
    // MARK: - Table view delegate
    
    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        selectedTitle = rowTitles[indexPath.section][indexPath.row]
        selectedUrl = urls[indexPath.section][indexPath.row]
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
        self.performSegueWithIdentifier("toInformationDetail", sender: self)
    }

}
