<?php
// Use in the "Post-Receive URLs" section of your GitHub repo.
  echo shell_exec( 'cd /var/www/html/staging/vrapp/github/vridiot.github.io/ && sudo git reset --hard HEAD && sudo git pull' );
  $myfile = fopen("lastupdate.txt", "w") or die("Unable to open file!");
  $txt = time ();
  fwrite($myfile, $txt);
  fclose($myfile);
?>