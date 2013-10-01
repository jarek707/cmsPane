<?php
class db extends mysqli {
    public function __construct($host, $user, $pass, $db) {
        parent::init();

        if (!parent::options(MYSQLI_INIT_COMMAND, 'SET AUTOCOMMIT = 0')) {
            die('Setting MYSQLI_INIT_COMMAND failed');
        }

        if (!parent::options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) {
            die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
        }

        if (!parent::real_connect($host, $user, $pass, $db)) {
            die('Connect Error (' . mysqli_connect_errno() . ') '
                    . mysqli_connect_error());
        }
    }

    public function save() {
    }

    public function getAll( $table ) {
        $out = array();

        if ($res = $this->query('SELECT * FROM users')) {
            while( $obj = $res->fetch_object() )  {
                $out[] = $obj;
            }
        }

        return $out;
    }
}

$db = new db('kodemaistercom.ipagemysql.com', 'club', 'club_99','club');

$action = $_GET['action'];
$tab    = $_GET['table'];

if ($action == 'get' ) {
    echo json_encode($db->getAll($tab));
} elseif ($action == 'post') {
    $data = $_POST['data'];
    echo 'Nothing to post yet';
}

$db->close();
?>
