//
//  SummonerViewController.swift
//  Riot API
//
//  Created by George Lo on 4/14/15.
//  Copyright (c) 2015 George & Rhys. All rights reserved.
//

import UIKit
import WebKit

class SummonerViewController: UIViewController, UIActionSheetDelegate, UISearchBarDelegate, WKNavigationDelegate {
    
    var region = "na"
    var shouldBeginEditing: Bool = true
    let webView = WKWebView()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Set Up search bar
        
        let searchBar = UISearchBar(frame: CGRectMake(0, 0, UIScreen.mainScreen().bounds.width - 72, 44))
        searchBar.placeholder = "Summoner's name"
        searchBar.searchBarStyle = UISearchBarStyle.Minimal
        searchBar.delegate = self
        
        let barWrapper = UIView(frame: searchBar.bounds)
        barWrapper.addSubview(searchBar)
        self.navigationItem.titleView = barWrapper
        
        // Set Up region button
        
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(image: UIImage(named: "Region"), style: UIBarButtonItemStyle.Done, target: self, action: "showRegionActionSheet")
        
        // Set Up web view
        
        webView.loadHTMLString(
            "<img src=\"http://3.bp.blogspot.com/-fnFX1XGzlw8/Ul5d-qR8-tI/AAAAAAAAAA0/fS0_WEIhhwc/s1600/teemo_panda.png\" />" +
            "<div style=\"font-family:Helvetica Neue;padding: 50px;\">" +
            "<h1 align=\"center\">Search for a summoner</h1><h2><ol>" +
                "<li>Choose the region by tapping the <img src=\"data:image/png;base64,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\"> icon on upper left corner</li>" +
                "<li>Type the summoner's name into the search bar</li>" +
                "<li>Press the search button on the keyboard after you finish typing</li>" +
            "</ol></h2></div>", baseURL: nil)
        webView.navigationDelegate = self
        self.view = webView
    }
    
    func showRegionActionSheet() {
        UIActionSheet(title: "Choose the region associated with the summoner you are going to search", delegate: self, cancelButtonTitle: "Cancel", destructiveButtonTitle: nil, otherButtonTitles: "Korea", "North America", "Europe West", "Europe Nordic & East", "Oceania", "Brazil", "LAS", "LAN", "Russia", "Turkey").showFromBarButtonItem(self.navigationItem.leftBarButtonItem, animated: true)
    }
    
    // MARK: - Web View delegate
    
    func webView(webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    }
    
    func webView(webView: WKWebView, didFinishNavigation navigation: WKNavigation!) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }
    
    func webView(webView: WKWebView, didFailNavigation navigation: WKNavigation!, withError error: NSError) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }
    
    func webView(webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: NSError) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }
    
    // MARK: - Action Sheet delegate
    
    func actionSheet(actionSheet: UIActionSheet, clickedButtonAtIndex buttonIndex: Int) {
        if buttonIndex == 1 {
            region = "www"
        } else if buttonIndex == 2 {
            region = "na"
        } else if buttonIndex == 3 {
            region = "euw"
        } else if buttonIndex == 4 {
            region = "eune"
        } else if buttonIndex == 5 {
            region = "oce"
        } else if buttonIndex == 6 {
            region = "br"
        } else if buttonIndex == 7 {
            region = "las"
        } else if buttonIndex == 8 {
            region = "lan"
        } else if buttonIndex == 9 {
            region = "ru"
        } else if buttonIndex == 10 {
            region = "tr"
        }
    }
    
    // MARK: - Search Bar delegate
    
    func searchBar(searchBar: UISearchBar, textDidChange searchText: String) {
        if searchBar.isFirstResponder() == false {
            shouldBeginEditing = false
        }
    }
    
    func searchBarShouldBeginEditing(searchBar: UISearchBar) -> Bool {
        let returnValue = shouldBeginEditing
        shouldBeginEditing = true
        return returnValue
    }
    
    func searchBarSearchButtonClicked(searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
        
        // Formulate URL & Load new webpage
        if count(searchBar.text) < 1 {
            UIAlertView(title: "Error", message: "The search text cannot be empty", delegate: nil, cancelButtonTitle: "OK").show()
        } else {
            let urlString = "http://" + region + ".op.gg/summoner/userName=" + searchBar.text.stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding)!
            webView.loadRequest(NSURLRequest(URL: NSURL(string: urlString)!))
        }
    }
    
    func searchBarCancelButtonClicked(searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
    }
    
    func searchBarTextDidBeginEditing(searchBar: UISearchBar) {
        searchBar.setShowsCancelButton(true, animated: true)
    }
    
    func searchBarTextDidEndEditing(searchBar: UISearchBar) {
        searchBar.setShowsCancelButton(false, animated: true)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}
