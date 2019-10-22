<?php
$http_origin = $_SERVER['HTTP_ORIGIN'];
if ($http_origin == "http://localhost:3000" || $http_origin == "YOUR_URL_HERE")
{  
	header("Access-Control-Allow-Origin: $http_origin");
}

header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');  
 

if (!isset($_POST['code']))
{
	exit('code param missing.');
}


$code = $_POST["code"];


$data = [
	"grant_type" => "authorization_code",
	"client_id" => "YOUR_CLIENT_ID",
	"client_secret" => "YOUR_CLIENT_SECRET",
	"code" => $code,
	"redirect_uri" => $http_origin,
];
$data_string = json_encode($data);

$ch = curl_init('https://login.microsoftonline.com/common/oauth2/v2.0/token');

curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$output = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
print ($output );


?>