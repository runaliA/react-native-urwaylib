//
//  RCTapplepay.swift
//  DApplePay
//
//  Created by Urway-144 on 30/11/2022.
//

import Foundation
import UIKit
import PassKit
import React

typealias PaymentCompletionHandler = (Bool) -> Void



@objc(Applepay)
class Applepay : NSObject {

  var paymentController: PKPaymentAuthorizationController?
  var paymentSummaryItems = [PKPaymentSummaryItem]()
  var paymentStatus = PKPaymentAuthorizationStatus.failure
  var completionHandler: PaymentCompletionHandler!
  var appleToken : PKPayment?
  var merchantIdentfier : String?
  var label : String?
  var response :RCTResponseSenderBlock?
  var result : PKPaymentAuthorizationResult?
  var amount : String?
  var country : String?
  var currency : String? 
  var err : PKPaymentAuthorizationResult?

  
  

  @available(iOS 12.1.1, *)
  static let supportedNetworks: [PKPaymentNetwork] = [
      .amex,
      .discover,
      .masterCard,
      .visa,
      .mada,
      .quicPay
  ]
  static let supportedNetworksWithoutMada: [PKPaymentNetwork] = [
      .amex,
      .discover,
      .masterCard,
      .visa,
      .quicPay
  ]

@objc
  func createApplePayToken(_ merchantIdentfier:String,amount:String,label:String,country:String,currency:String,callback:@escaping RCTResponseSenderBlock) -> Void {
    
    let deviceCanMakePayment = Applepay.applePayStatus();
     print(" createApplePayToken : \(deviceCanMakePayment)")
    if !deviceCanMakePayment {

      callback(["this device dose not support applepay"]);
    }
    else {
      self.merchantIdentfier = merchantIdentfier;
      self.label = label;
      self.response = callback;
      self.amount = amount
      self.country = country
      self.currency = currency
      
      self.startPayment()
    }
  }

    
  func startPayment() -> Void{
    let total = PKPaymentSummaryItem(label: self.label!, amount: NSDecimalNumber(string: self.amount!), type: .final)
      paymentSummaryItems = [total]
      let paymentRequest = PKPaymentRequest()
      paymentRequest.paymentSummaryItems = paymentSummaryItems
      paymentRequest.merchantIdentifier = merchantIdentfier ?? ""
      paymentRequest.merchantCapabilities = .capability3DS
      paymentRequest.countryCode = country ?? ""
      paymentRequest.currencyCode = currency ?? ""
        if #available(iOS 12.1.1, *) {
          paymentRequest.supportedNetworks = Applepay.supportedNetworks
      } else {
          paymentRequest.supportedNetworks = Applepay.supportedNetworksWithoutMada
      }
      
      paymentController = PKPaymentAuthorizationController(paymentRequest: paymentRequest)
      paymentController?.delegate = self
      paymentController?.present(completion: { (presented: Bool) in
          if presented {
              debugPrint("Presented payment controller")
          } else {
            self.response!(["apple pay is not set up correctly: [ no cards , merchantIdentifier]"])
            debugPrint("Failed to present payment controller")
              
          }
      })
    }
    
  class func applePayStatus() -> (Bool) {
      return (PKPaymentAuthorizationController.canMakePayments())
    
  }
  func getToken (token:PKPayment) -> PKPayment {
    return token
  }
  
  public static func generatePaymentKey(payment: PKPayment) -> NSString {
      
      let data12 = payment.token.paymentData
      let method = payment.token.paymentMethod
      
      if let jsonString = NSString(data: data12, encoding: .zero) {
          
          let prefixString: NSString = "\("{ \"paymentData\"  : ")" as NSString
          let finalSuffixString: NSString = """
              , "paymentMethod": {
              "displayName": "\(method.displayName ?? "")",
              "network": "\(method.network?.rawValue ?? "")",
              "type": "debit"
              },
              "transactionIdentifier": "\(payment.token.transactionIdentifier)" }
              """ as NSString
          
          let combinderString: NSString = "\(prefixString) \(jsonString) \(finalSuffixString)" as NSString
          print("apple pay token is equal to : \(combinderString)")
          return combinderString
      }
      
      return ""
  }
  
  @objc
    static func requiresMainQueueSetup() -> Bool {
    return false;
  }
  
}

extension Applepay: PKPaymentAuthorizationControllerDelegate {

    func paymentAuthorizationController(_ controller: PKPaymentAuthorizationController, didAuthorizePayment payment: PKPayment, handler completion: @escaping (PKPaymentAuthorizationResult) -> Void) {
      let token = Applepay.generatePaymentKey(payment: payment)

      self.paymentStatus = .success
      self.response!([NSNull(),token])
      
      
      completion(PKPaymentAuthorizationResult(status: self.paymentStatus, errors: nil ))
        
    }
    
    func paymentAuthorizationControllerDidFinish(_ controller: PKPaymentAuthorizationController) {
        print("sheet closed")
        controller.dismiss(completion: nil)
    }
}
