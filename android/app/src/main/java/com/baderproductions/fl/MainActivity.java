package com.baderproductions.fl;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
// react-native-orientation-locker
import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {

  // react-native-orientation-locker
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
      this.sendBroadcast(intent);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    SplashScreen.show(this, R.style.SplashScreenTheme);
    return "filelist";
  }
}
