<?php
// Use in the "Post-Receive URLs" section of your GitHub repo.
  shell_exec( 'cd /var/www/html/staging/vrapp/github/vridiot.github.io/ && sudo git reset --hard HEAD && sudo git pull' );
?>