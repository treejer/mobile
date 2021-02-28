#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

#import <UMCore/UMAppDelegateWrapper.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
