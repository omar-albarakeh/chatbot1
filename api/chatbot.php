<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $apiKey = '###';

    $data = json_decode(file_get_contents("php://input"), true);
    $userMessage = $data['message'] ?? '';

    $url = 'https://api.openai.com/v1/chat/completions';

    $payload = [
        'model' => 'gpt-3.5-turbo',
        'messages' => [
            ['role' => 'user', 'content' => $userMessage]
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    $response = curl_exec($ch);
    curl_close($ch);
    echo $response;
}
?>
