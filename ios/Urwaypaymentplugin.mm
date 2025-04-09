//
//  RCTApplepay.m
//  DApplePay
//
//  Created by Urway-144 on 30/11/2022.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Applepay,NSObject)

RCT_EXTERN_METHOD(createApplePayToken:(NSString *)merchantIdentfier 
amount:(NSString *) amount 
label:(NSString *) label 
 country:(NSString *) country
 currency:(NSString *) currency
callback: (RCTResponseSenderBlock)callback)


@end
