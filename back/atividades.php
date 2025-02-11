<?php
require __DIR__ . '/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('SECRET_KEY', 'sua_chave_secreta');

function verificarToken()
{
    $token = null;

    $headers = apache_request_headers();

    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
    }

    if ($token) {
        try {
            $decoded = JWT::decode($token, new Key(SECRET_KEY, 'HS256'));

            return $decoded->usuario_id;
        } catch (Exception $e) {
            http_response_code(401); 
            echo json_encode(array("mensagem" => "Token inválido"));
            exit;
        }
    } else {
        http_response_code(401); 
        echo json_encode(array("mensagem" => "Token não fornecido"));
        exit;
    }
}


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servidor = "localhost:3306";
$usuario = "root";
$senha = "";
$banco_de_dados = "gestor_atividades";

try {
    $conexao = new PDO("mysql:host=$servidor;dbname=$banco_de_dados", $usuario, $senha);
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(["mensagem" => "Erro na conexão com o banco de dados: " . $e->getMessage()]);
    exit();
}

function obterAtividadesDoUsuario($conexao, $usuario_id)
{
    $consulta = $conexao->prepare("SELECT * FROM atividades WHERE id_usuario = :usuario_id");
    $consulta->bindParam(':usuario_id', $usuario_id);
    $consulta->execute();
    $resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($resultados);
}

function adicionarAtividade($conexao, $dados, $usuario_id)
{
    $atividade = json_decode($dados, true);
    $data_criacao = date('Y-m-d H:i:s');
    
    $consulta = $conexao->prepare("INSERT INTO atividades (titulo, data_criacao, id_usuario, data_conclusao, descricao) VALUES (:titulo, :data_criacao, :id_usuario, :data_conclusao, :descricao)");
    $consulta->bindParam(':titulo', $atividade['titulo']);
    $consulta->bindParam(':data_criacao', $data_criacao); // data de criação atual
    $consulta->bindParam(':id_usuario', $usuario_id);
    $consulta->bindParam(':data_conclusao', $atividade['data_conclusao']);
    $consulta->bindParam(':descricao', $atividade['descricao']);
    
    try {
        $consulta->execute();

        $atividade_id = $conexao->lastInsertId(); // Obtém o ID da atividade inserida
        
        // Realiza uma consulta para obter a atividade recém-criada, incluindo a data de criação
        $consulta = $conexao->prepare("SELECT * FROM atividades WHERE id = :id");
        $consulta->bindParam(':id', $atividade_id);
        $consulta->execute();
        $atividade_criada = $consulta->fetch(PDO::FETCH_ASSOC);

        return json_encode(['atividade' => $atividade_criada]);
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        return json_encode(['mensagem' => 'Erro ao adicionar a atividade: ' . $e->getMessage()]);
    }
}


function excluirAtividade($conexao, $id_atividade, $usuario_id)
{
    $consulta = $conexao->prepare("DELETE FROM atividades WHERE id = :id AND id_usuario = :usuario_id");
    $consulta->bindParam(':id', $id_atividade);
    $consulta->bindParam(':usuario_id', $usuario_id);
    $consulta->execute();

    if ($consulta->rowCount() > 0) {
        return ['mensagem' => 'Atividade excluída com sucesso'];
    } else {
        http_response_code(404); // Not Found
        return ['mensagem' => 'Atividade não encontrada'];
    }
}

function atualizarAtividade($conexao, $dados, $usuario_id)
{
    $atividade = json_decode($dados, true);

    if (!isset($atividade['id'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['mensagem' => 'ID da atividade não fornecido']);
        exit;
    }

    try {
        $consulta = $conexao->prepare("UPDATE atividades SET titulo = :titulo, data_conclusao = :data_conclusao, descricao = :descricao WHERE id = :id AND id_usuario = :usuario_id");
        $consulta->bindParam(':titulo', $atividade['titulo']);
        $consulta->bindParam(':data_conclusao', $atividade['data_conclusao']);
        $consulta->bindParam(':descricao', $atividade['descricao']);
        $consulta->bindParam(':id', $atividade['id']);
        $consulta->bindParam(':usuario_id', $usuario_id);
        $consulta->execute();

        if ($consulta->rowCount() > 0) {
            return ['mensagem' => 'Atividade atualizada com sucesso'];
        } else {
            http_response_code(404); // Not Found
            return ['mensagem' => 'Atividade não encontrada'];
        }
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        return ['mensagem' => 'Erro ao atualizar a atividade: ' . $e->getMessage()];
    }
}

function atualizarStatusAtividade($conexao, $usuario_id, $id_atividade, $novo_status)
{
    try {
       
        $consulta = $conexao->prepare("UPDATE atividades SET status = :status WHERE id = :id AND id_usuario = :usuario_id");
        $consulta->bindParam(':status', $novo_status);
        $consulta->bindParam(':id', $id_atividade);
        $consulta->bindParam(':usuario_id', $usuario_id);
        $consulta->execute();

        if ($consulta->rowCount() > 0) {
            return ['mensagem' => 'Status da atividade atualizado para concluído'];
        } else {
            http_response_code(404); // Not Found
            return ['mensagem' => 'Atividade não encontrada'];
        }
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        return ['mensagem' => 'Erro ao atualizar o status da atividade: ' . $e->getMessage()];
    }
}


$metodo_requisicao = $_SERVER["REQUEST_METHOD"];
switch ($metodo_requisicao) {
    case 'OPTIONS':
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        break;
    case 'GET':
        $usuario_id = verificarToken();
        echo obterAtividadesDoUsuario($conexao, $usuario_id);
        break;
    case 'POST':
        $usuario_id = verificarToken();
        $dados = file_get_contents("php://input");
        echo adicionarAtividade($conexao, $dados, $usuario_id);
        break;
    case 'DELETE':
        $usuario_id = verificarToken();
        $id_atividade = $_GET['id'] ?? null;

        if (!$id_atividade) {
            http_response_code(400); // Bad Request
            echo json_encode(['mensagem' => 'ID da atividade não fornecido']);
            exit;
        }

        echo json_encode(excluirAtividade($conexao, $id_atividade, $usuario_id));
        break;
    case 'PUT':
        $usuario_id = verificarToken();
        $dados = file_get_contents("php://input");
        echo json_encode(atualizarAtividade($conexao, $dados, $usuario_id));
        break;
    case 'PATCH':
        $usuario_id = verificarToken();
        $dados = json_decode(file_get_contents("php://input"), true);
        $id_atividade = $dados['id'] ?? null;
        $novo_status = 'concluído';

        if (!$id_atividade) {
            http_response_code(400); // Bad Request
            echo json_encode(['mensagem' => 'ID da atividade não fornecido']);
            exit;
        }

        echo json_encode(atualizarStatusAtividade($conexao, $usuario_id, $id_atividade, $novo_status));
        break;
    default:
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido']);
        break;
}

$conexao = null;
?>