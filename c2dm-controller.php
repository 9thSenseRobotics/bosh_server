<?php

error_reporting(0);

require_once('officebot-include.php'); 
include ('robotMessages.php');

$phonereg = '758fa234cb7edb05';
/**
 * Gets an authentication token for a Google service (defaults to
 * Picasa). Puts the token in a session variable and re-uses it as
 * needed, instead of fetching a new token for every call.
 *
 * @static
 * @access public
 * @param string $username Google email account
 * @param string $password Password for Google email account
 * @param string $source name of the calling application (defaults to your_google_app)
 * @param string $service name of the Google service to call (defaults to cloud to device messaging for Android)
 * @return boolean|string An authentication token, or false on failure
 */

 
function googleAuthenticate($username, $password, $source = 'org.abarry.telo', $service = 'ac2dm') {
    //$session_token = $source . '_' . $service . '_auth_token';
    $session_token = "auth_token";

    if ($_SESSION[$session_token]) {
        return $_SESSION[$session_token];
    }

    // get an authorization token
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.google.com/accounts/ClientLogin");
    $post_fields = "accountType=" . urlencode('GOOGLE')
        . "&Email=" . urlencode($username)
        . "&Passwd=" . urlencode($password)
        . "&source=" . urlencode($source)
        . "&service=" . urlencode($service);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HEADER, TRUE);
    
    curl_setopt($ch, CURLINFO_HEADER_OUT, true); // for debugging the request
    var_dump(curl_getinfo($ch,CURLINFO_HEADER_OUT)); //for debugging the request

    $response = curl_exec($ch);
    curl_close($ch);
    

    if (strpos($response, '200 OK') === false) {
        return false;
    }

    // find the auth code
    preg_match("/(Auth=)([\w|-]+)/", $response, $matches);

    if (!$matches[2]) {
        return false;
    }

    $_SESSION[$session_token] = $matches[2];
    return $matches[2];
}

/**
 * Sends a push notification to an Android device using Google C2DM when given a payload (under 1024 bytes),
 * the server authorization code, and the phone registration id.
 *
 * @param datain less than 1024 bytes of input to be sent to the device (string)
 * @param serverAuth server authorization obtained from googleAuthenticate
 * @param phoneRegistrationId registration of the target phone.  This must be obtained from the phone, and we get it out of a database on a previous page.
 */
function sendAndroidPush($datain, $serverAuth, $phoneRegistrationId)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://android.apis.google.com/c2dm/send");
     $post_fields = "registration_id=" . urlencode($phoneRegistrationId)
        . "&data.payload=" . urlencode($datain)
        . "&collapse_key=0";
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HEADER, TRUE);
    curl_setopt($ch,CURLOPT_HTTPHEADER,array('Authorization: GoogleLogin auth=' . $serverAuth));
    
    curl_setopt($ch, CURLINFO_HEADER_OUT, true); // for debugging the request
 //   var_dump(curl_getinfo($ch,CURLINFO_HEADER_OUT)); //for debugging the request


    $response = curl_exec($ch);
//    echo $response;
    curl_close($ch);
}

function robot_command($cmd)
{
	global $conn, $createActionTable, $robotname, $sendStr, $phonereg;
	$stamp = microtime(true);
	$ts = str_replace('.', '', microtime(true));

	$sql = "SELECT * FROM phones WHERE deviceid=\"" . mysql_real_escape_string($phoneid) . "\"";
	$result = mysql_query($sql);
	$myrow = mysql_fetch_array($result);
	
	if (strlen($myrow["registration"]) > 0) {
		$phoneReg = $myrow["registration"];
	}
	$robot = $_REQUEST['robotAddr'];
	if (is_numeric($_REQUEST['speed']))
	{
		$speed = $_REQUEST['speed'];
	} else {
		$speed = '';
	}
	if ($cmd == 's') // it's a reset, so make the sequence number larger
	{
		$seq = 20;
	} else {
		$seq = $_REQUEST['seq'];
	}
	
	$mtr = new messageToRobot($robot, $robot, $robot, $cmd, $speed, '', $seq);
	$ts = $mtr->timeStamp;
	$sendStr = $mtr->XML->asXML();
	sendAndroidPush($sendStr, $_SESSION["auth_token"], $phoneReg);
	if (strlen($sendStr))
	{
		return ($sendStr);
	} else {
		return (false);
	} 
}

session_start();


	header("Content-type: text/json");
	if (isset ($_REQUEST['cmd']))
	{
		$json = robot_command($_REQUEST['cmd']);
	} 
	if (isset ($_REQUEST['pantilt']))
	{	
		$json = robot_command($_REQUEST['pantilt']);
	}
	header ("Content-type: text/json\n");
	if ($json !== false)
	{
		echo ($json);
	} else {
		echo (json_encode(array('status' => 'failed')));
	}

	// check for an existing auth token from google
	if (!isset($_SESSION["auth_token"]) || strlen($_SESSION["auth_token"]) < 5)
	{
		googleAuthenticate("telebotphone@gmail.com", "9thsense&");

	}
	
	// we have the phone id and the auth id, we're good to go!
	//echo "have auth already";

?>
