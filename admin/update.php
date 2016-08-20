<?
extract($_POST);

//validate username/password
include('defines.php');
$db = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
if($db->connect_errno) {
	echo json_encode(array('success' => false, 'error' => 'DB_CONNECT'));
	exit();
}

$match = false;
$users = $db->query('select user_login,user_pass,user_nicename,user_email from wp_users');
if($users) {
	require_once('../wp-includes/class-phpass.php');
	// By default, use the portable hash from phpass
	$wp_hasher = new PasswordHash(8, true);

	while($user = $users->fetch_assoc()) {
		if(strtolower($user['user_login']) == strtolower($username)) {
			if(!$wp_hasher->CheckPassword($password, $user['user_pass'])) {
				echo json_encode(array('success' => false, 'error' => 'WRONG_PASSWORD', 'hash' => $hash));
				exit();
			} else $match = true;
			break;
		}
	}
}
if(!$match) {
	echo json_encode(array('success' => false, 'error' => 'NO_SUCH_USER'));
	exit();
}

$lines = array();

if($open == 'true') {
	$lines[] = 'open';
	$lines[] = $type;
	$lines[] = $start;
	$lines[] = $end;
} else {
	$lines[] = 'closed';
}

file_put_contents('status.txt', implode(PHP_EOL, $lines) . PHP_EOL);

echo json_encode(array('success' => true, 'fields' => $_POST));

?>
