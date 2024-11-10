<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    $apiKey = getenv('OPENAI_API_KEY'); 
    if (!$apiKey) {
        echo json_encode(['error' => 'API key is missing.']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $userMessage = $data['message'] ?? '';


    $intent = '';
    if (preg_match('/recommend|suggest/i', $userMessage)) {
        $intent = 'recommendation';
    } elseif (preg_match('/plot|summary/i', $userMessage)) {
        $intent = 'plot_summary';
    } else {
        $intent = 'general_question';
    }


    $prompt = 'You are an AI movie expert. ';
    if ($intent === 'recommendation') {
        $prompt .= 'Provide a personalized movie recommendation based on the following user input.';
    } elseif ($intent === 'plot_summary') {
        $prompt .= 'Summarize the plot of the movie mentioned in the following user input.';
    } else {
        $prompt .= 'Answer the following question about movies.';
    }

    $payload = [
        'model' => 'gpt-3.5-turbo',
        'messages' => [
            ['role' => 'system', 'content' => $prompt],
            ['role' => 'user', 'content' => $userMessage]
        ]
    ];

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

    $response = curl_exec($ch);

    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        echo json_encode(['error' => "Request failed: $error"]);
        exit;
    }

    curl_close($ch);

    echo $response;
}
?>
