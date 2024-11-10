<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    $apiKey = getenv('OPENAI_API_KEY');
    if (!$apiKey) {
        echo json_encode(['error' => 'API key is missing.']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $userMessage = $data['message'] ?? '';

    if (!isset($_SESSION['conversation'])) {
        $_SESSION['conversation'] = [
            'questions' => [
                "What's your favorite movie genre?",
                "Do you prefer movies from a specific decade?",
                "Who is one of your favorite actors or directors?",
                "What kind of mood are you looking for in a movie (e.g., uplifting, thrilling)?"
            ],
            'responses' => [],
            'current_question' => 0
        ];
    }

    $conversation = &$_SESSION['conversation'];

    if ($conversation['current_question'] >= count($conversation['questions'])) {
        $responses = implode(", ", $conversation['responses']);
        $prompt = "Based on these preferences: $responses, recommend a personalized movie.";

        $payload = [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are an AI movie expert.'],
                ['role' => 'user', 'content' => $prompt]
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

        unset($_SESSION['conversation']);
        echo $response;
    } else {
        if (!empty($userMessage)) {
            $conversation['responses'][] = $userMessage;
            $conversation['current_question']++;
        }

        if ($conversation['current_question'] < count($conversation['questions'])) {
            $nextQuestion = $conversation['questions'][$conversation['current_question']];
            echo json_encode(['message' => $nextQuestion]);
        } else {
            echo json_encode(['message' => "Processing your personalized movie recommendation..."]);
        }
    }
}
?>
