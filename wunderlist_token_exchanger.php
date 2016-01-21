<?php

header('Access-Control-Allow-Origin: YOUR_URL_HERE');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');  

if (!isset($_POST['code']))
{
	exit('code param missing.');
}

$code = $_POST["code"];

$data = array
(
	"client_id" => "YOUR_CLIENT_ID",
	"client_secret" => "YOUR_CLIENT_SECRET",
	"code" => $code,
);
$data_string = json_encode($data);

$ch = curl_init('https://www.wunderlist.com/oauth/access_token');

curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
curl_setopt($ch,CURLOPT_HEADER, false); 
curl_setopt($ch, CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
curl_setopt($ch,CURLOPT_POST, true); 
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);

$output = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
print ($output );

?>