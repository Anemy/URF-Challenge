//
//  Champion.swift
//  Riot API
//
//  Created by George Lo on 4/14/15.
//  Copyright (c) 2015 George & Rhys. All rights reserved.
//

import UIKit

class Champion: NSObject, NSCoding {
    var averageAssists: Double
    var averageCS: Double
    var averageDeaths: Double
    var averageGold: Double
    var averageKills: Double
    
    var champID: Int
    var champName: String
    
    var cs: Int
    var deaths: Int
    var gold: Int
    var kda: Double
    var kills: Int
    
    var totalLosses: Int
    var totalPlays: Int
    var totalWins: Int
    
    var winRate: Double
    
    init(averageAssists: Double, averageCS: Double, averageDeaths: Double, averageGold: Double, averageKills: Double, champID: Int, champName: String, cs: Int, deaths: Int, gold: Int, kda: Double, kills: Int, totalLosses: Int, totalPlays: Int, totalWins: Int, winRate: Double) {
        self.averageAssists = averageAssists
        self.averageCS = averageCS
        self.averageDeaths = averageDeaths
        self.averageGold = averageGold
        self.averageKills = averageKills
        
        self.champID = champID
        self.champName = champName
        
        self.cs = cs
        self.deaths = deaths
        self.gold = gold
        self.kda = kda
        self.kills = kills
        
        self.totalLosses = totalLosses
        self.totalPlays = totalPlays
        self.totalWins = totalWins
        self.winRate = winRate
    }
    
    func encodeWithCoder(aCoder: NSCoder) {
        aCoder.encodeDouble(averageAssists, forKey: "averageAssists")
        aCoder.encodeDouble(averageCS, forKey: "averageCS")
        aCoder.encodeDouble(averageDeaths, forKey: "averageDeaths")
        aCoder.encodeDouble(averageGold, forKey: "averageGold")
        aCoder.encodeDouble(averageKills, forKey: "averageKills")
        
        aCoder.encodeInteger(champID, forKey: "champID")
        aCoder.encodeObject(champName, forKey: "champName")
        
        aCoder.encodeInteger(cs, forKey: "cs")
        aCoder.encodeInteger(deaths, forKey: "deaths")
        aCoder.encodeInteger(gold, forKey: "gold")
        aCoder.encodeDouble(kda, forKey: "kda")
        aCoder.encodeInteger(kills, forKey: "kills")
        
        aCoder.encodeInteger(totalLosses, forKey: "totalLosses")
        aCoder.encodeInteger(totalPlays, forKey: "totalPlays")
        aCoder.encodeInteger(totalWins, forKey: "totalWins")
        aCoder.encodeDouble(winRate, forKey: "winRate")
    }
    
    required init(coder aDecoder: NSCoder) {
        averageAssists = aDecoder.decodeDoubleForKey("averageAssists")
        averageCS = aDecoder.decodeDoubleForKey("averageCS")
        averageDeaths = aDecoder.decodeDoubleForKey("averageDeaths")
        averageGold = aDecoder.decodeDoubleForKey("averageGold")
        averageKills = aDecoder.decodeDoubleForKey("averageKills")
        
        champID = aDecoder.decodeIntegerForKey("champID")
        champName = aDecoder.decodeObjectForKey("champName") as! String
        
        cs = aDecoder.decodeIntegerForKey("cs")
        deaths = aDecoder.decodeIntegerForKey("deaths")
        gold = aDecoder.decodeIntegerForKey("gold")
        kda = aDecoder.decodeDoubleForKey("kda")
        kills = aDecoder.decodeIntegerForKey("kills")
        
        totalLosses = aDecoder.decodeIntegerForKey("totalLosses")
        totalPlays = aDecoder.decodeIntegerForKey("totalPlays")
        totalWins = aDecoder.decodeIntegerForKey("totalWins")
        winRate = aDecoder.decodeDoubleForKey("winRate")
    }
    
    class func saveChampions(champions: [Champion]) {
        let encodedObject = NSKeyedArchiver.archivedDataWithRootObject(champions)
        NSUserDefaults.standardUserDefaults().setObject(encodedObject, forKey: "champions")
        NSUserDefaults.standardUserDefaults().synchronize()
    }
    
    class func loadChampions() -> [Champion] {
        if let encodedObject = NSUserDefaults.standardUserDefaults().objectForKey("champions") as? NSData {
            return NSKeyedUnarchiver.unarchiveObjectWithData(encodedObject) as! [Champion]
        } else {
            return []
        }
    }
    
}
