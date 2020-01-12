package host.exp.exponent;

import com.facebook.react.ReactPackage;

import org.unimodules.core.interfaces.Package;

import java.util.Arrays;
import java.util.List;

import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
import host.exp.exponent.generated.BasePackageList;
import okhttp3.OkHttpClient;
import com.wenkesj.voice.VoicePackage;
import com.rnfs.RNFSPackage;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.horcrux.svg.SvgPackage;
import com.adamfreeman.rnocv3.RNOpencv3Package;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.reactnative.camera.RNCameraPackage;

public class MainApplication extends ExpoApplication implements AppLoaderPackagesProviderInterface<ReactPackage> {

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        // TODO: add native modules!
        new VoicePackage(),
        new RNFSPackage(),

        // Needed for `react-native link`
        // new MainReactPackage(),
            new RNPermissionsPackage(),
            // new SvgPackage(),
            new RNOpencv3Package(),
            // new RNGestureHandlerPackage(),
            new RNCameraPackage()
    );
  }

  public List<Package> getExpoPackages() {
    return new BasePackageList().getPackageList();
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }
  
}
