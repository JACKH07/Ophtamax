<?php

if (!($_SESSION['PROFILE']['ROLE']== 'ADMIN')){

    header("location:$_SERVER[HTTP_REFERER]");
}
?>