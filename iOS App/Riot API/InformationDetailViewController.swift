//
//  InformationDetailViewController.swift
//  Riot API
//
//  Created by George Lo on 4/16/15.
//  Copyright (c) 2015 George & Rhys. All rights reserved.
//

import UIKit
import WebKit

class InformationDetailViewController: UIViewController, WKNavigationDelegate {
    
    var url: NSURL?

    override func viewDidLoad() {
        super.viewDidLoad()

        let webView = WKWebView(frame: CGRectZero)
        webView.navigationDelegate = self
        webView.loadRequest(NSURLRequest(URL: url!))
        self.view = webView
    }
    
    // MARK: - WKNavigation Delegate
    
    func webView(webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        self.navigationItem.title = webView.title
        UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    }
    
    func webView(webView: WKWebView, didFinishNavigation navigation: WKNavigation!) {
        self.navigationItem.title = webView.title
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }
    
    func webView(webView: WKWebView, didFailNavigation navigation: WKNavigation!, withError error: NSError) {
        self.navigationItem.title = webView.title
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }
    
    func webView(webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: NSError) {
        self.navigationItem.title = webView.title
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
