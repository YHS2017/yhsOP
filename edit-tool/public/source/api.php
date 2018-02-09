<?php
header("Content-type: text/html; charset=utf-8"); 
// 创建一个新cURL资源
$apipoint = $_REQUEST['apipoint'];
$apidata = $_REQUEST['apidata'];
$ch = curl_init();
// $url_login = 'http://172.168.11.190:8090/v1/auth/login';
// $url_getlist = 'http://172.168.11.190:8090/v1/project/all';
// $url_getproject = 'http://172.168.11.190:8090/v1/project/';
// $url_updateproject = 'http://172.168.11.190:8090/v1/project/';
// $url_updateprojectinfo = 'http://172.168.11.190:8090/v1/project/outline';
// $url_newproject = 'http://172.168.11.190:8090/v1/project/new';
// $url_releaseproject = 'http://172.168.11.190:8090/v1/project/commit/';

$url_login = 'http://172.168.11.124:8060/v1/auth/login';
$url_getlist = 'http://172.168.11.124:8060/v1/project/all';
$url_getproject = 'http://172.168.11.124:8060/v1/project/';
$url_updateproject = 'http://172.168.11.124:8060/v1/project/';
$url_updateprojectinfo = 'http://172.168.11.124:8060/v1/project/outline';
$url_newproject = 'http://172.168.11.124:8060/v1/project/new';
$url_releaseproject = 'http://172.168.11.124:8060/v1/project/commit/';

// 设置URL和相应的选项
if($apipoint=='login'){
  curl_setopt($ch, CURLOPT_URL, $url_login);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length:0'));
}

if($apipoint=='getlist'){
  curl_setopt($ch, CURLOPT_URL, $url_getlist);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
}

if($apipoint=='getproject'){
  curl_setopt($ch, CURLOPT_URL, $url_getproject . $apidata);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
}

if($apipoint=='releaseproject'){
  curl_setopt($ch, CURLOPT_URL, $url_releaseproject . $apidata);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
}

if($apipoint=='updateproject'){
  curl_setopt($ch, CURLOPT_URL, $url_updateproject);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $apidata);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length:' . strlen($apidata)));
}

if($apipoint=='updateprojectinfo'){
  curl_setopt($ch, CURLOPT_URL, $url_updateprojectinfo);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $apidata);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length:' . strlen($apidata)));
}

if($apipoint=='newproject'){
  curl_setopt($ch, CURLOPT_URL, $url_newproject);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $apidata);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length:'. strlen($apidata)));
}

// 抓取URL并把它传递给浏览器
$result = curl_exec($ch);

// 关闭cURL资源，并且释放系统资源
curl_close($ch);

echo $result;
?>