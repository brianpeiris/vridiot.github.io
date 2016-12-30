<?php
// Use in the "Post-Receive URLs" section of your GitHub repo.
if ( $_POST['payload'] ) {
  shell_exec( 'sudo cd /var/www/html/staging/vrapp/github/vridiot.github.io/ && git reset --hard HEAD && git pull' );
}
?>