package host.exp.exponent;

import android.os.Bundle;

import com.facebook.react.ReactPackage;

import org.unimodules.core.interfaces.Package;

import java.util.List;

import host.exp.exponent.experience.DetachActivity;
import host.exp.exponent.generated.DetachBuildConstants;

import com.facebook.react.ReactPackage;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

public class MainActivity extends DetachActivity  implements PermissionAwareActivity{
  private PermissionListener permissionListener;
  @Override
  public String publishedUrl() {
    return "exp://exp.host/@hwadii/sight-study";
  }

  @Override
  public String developmentUrl() {
    return DetachBuildConstants.DEVELOPMENT_URL;
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public List<Package> expoPackages() {
    return ((MainApplication) getApplication()).getExpoPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    return expBundle;
  }
  
  public void requestPermissions(String[] permissions, int requestCode, PermissionListener listener) {
    permissionListener = listener;
    requestPermissions(permissions, requestCode);
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    if (permissionListener != null) {
        permissionListener.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
  }
  
}
