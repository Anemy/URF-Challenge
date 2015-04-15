//
//  URFTableViewCell.swift
//  Riot API
//
//  Created by George Lo on 4/15/15.
//  Copyright (c) 2015 George & Rhys. All rights reserved.
//

import UIKit

class URFTableViewCell: UITableViewCell {
    
    var imageIcon = PASImageView()
    var nameLabel = UILabel()
    var winRateLabel = UILabel()
    var playsLabel = UILabel()
    var kdaLabel = UILabel()
    var csLabel = UILabel()
    var goldLabel = UILabel()

    override func awakeFromNib() {
        super.awakeFromNib()
        
        let screenWidth = UIScreen.mainScreen().bounds.width
        let textWidth: CGFloat = 100
        
        var winRateText = UILabel(frame: CGRectMake(100, 27, textWidth, 15))
        var playsText = UILabel(frame: CGRectMake(100, 43, textWidth, 15))
        var kdaText = UILabel(frame: CGRectMake(100, 59, textWidth, 15))
        var csText = UILabel(frame: CGRectMake(100, 75, textWidth, 15))
        var goldText = UILabel(frame: CGRectMake(100, 91, textWidth, 15))
        
        winRateText.font = UIFont(name: "Avenir-Medium", size: 13)
        playsText.font = UIFont(name: "Avenir-Medium", size: 13)
        kdaText.font = UIFont(name: "Avenir-Medium", size: 13)
        csText.font = UIFont(name: "Avenir-Medium", size: 13)
        goldText.font = UIFont(name: "Avenir-Medium", size: 13)
        
        winRateText.text = "Win Rate"
        playsText.text = "Games Played"
        kdaText.text = "KDA"
        csText.text = "Average CS"
        goldText.text = "Average Gold"
        
        contentView.addSubview(winRateText)
        contentView.addSubview(playsText)
        contentView.addSubview(kdaText)
        contentView.addSubview(csText)
        contentView.addSubview(goldText)
        
        imageIcon.backgroundProgressColor(UIColor.whiteColor())
        imageIcon.progressColor(UIColor(red: 0.812, green: 0.729, blue: 0.42, alpha: 1))
        
        imageIcon.frame = CGRectMake(15, 7.5, 75, 75)
        nameLabel.frame = CGRectMake(100, 6.5, screenWidth - 100, 19)
        winRateLabel.frame = CGRectMake(100 + textWidth, 27, screenWidth - 100 - textWidth, 15)
        playsLabel.frame = CGRectMake(100 + textWidth, 43, screenWidth - 100 - textWidth, 15)
        kdaLabel.frame = CGRectMake(100 + textWidth, 59, screenWidth - 100 - textWidth, 15)
        csLabel.frame = CGRectMake(100 + textWidth, 75, screenWidth - 100 - textWidth, 15)
        goldLabel.frame = CGRectMake(100 + textWidth, 91, screenWidth - 100 - textWidth, 15)
        
        nameLabel.font = UIFont(name: "Avenir-Heavy", size: 17)
        winRateLabel.font = UIFont(name: "Avenir", size: 13)
        playsLabel.font = UIFont(name: "Avenir", size: 13)
        kdaLabel.font = UIFont(name: "Avenir", size: 13)
        csLabel.font = UIFont(name: "Avenir", size: 13)
        goldLabel.font = UIFont(name: "Avenir", size: 13)
        
        contentView.addSubview(imageIcon)
        contentView.addSubview(nameLabel)
        contentView.addSubview(winRateLabel)
        contentView.addSubview(playsLabel)
        contentView.addSubview(kdaLabel)
        contentView.addSubview(csLabel)
        contentView.addSubview(goldLabel)
        
        contentView.bringSubviewToFront(nameLabel)
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }

}
