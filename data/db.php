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

    public function insert($tab, $data) {
        $this->query($sql = "INSERT INTO $tab (`left`,`right`) VALUES ('" . $data['left'] . "' ,'" . $data['right'] . "')");

        return array($this->error, $sql);
    }

    public function update($tab, $data) {
        $this->query($sql = "UPDATE $tab SET `left` = '" . $data['left'] . "', `right`='" . $data['right'] . "' WHERE id=" . $data['id']);
        return array($this->error, $sql);
    }

    public function updateRel($tab, $rowId, $data) {
        //$data = mysql_real_escape_string($data);

        $numRows= mysqli_num_rows($this->query("SELECT * FROM `$tab` WHERE id=$rowId"));
        if ($numRows)  {
            $this->query($sql = "UPDATE `$tab` SET `rel` = '" . $data . "' WHERE id=$rowId");
        } else {
            $this->query($sql = "INSERT INTO `$tab` (`id`, `rel`) VALUES ($rowId, '" . $data . "')");
        }
        return array($this->error, $sql, $numRows);
    }


    public function getAll( $table ) {
        $out = array();

        if ($res = $this->query($sql = "SELECT * FROM $table")) {
            while( $obj = $res->fetch_object() )  {
                $out[$obj->id] = $obj;
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

    if ( isset($_GET['rel']) ) {
        echo 'rel found' . json_encode($_GET['rowId']) . '....POST>>' . json_encode($_POST). '<<POST..' . $tab;
        echo json_encode($db->updateRel($tab,$_GET['rowId'],  json_encode($_POST)));
    } else {
        echo 'rel NOT found'. json_encode($_GET);;
    }
    return false;
    try {
        $data = $_POST;
        if ($data['id'] > 0 ) {
            $res = $db->update($tab, $data);
        } else {
            $res = $db->insert($tab, $data);
        }

        echo json_encode(array($res, $_POST, $_GET['rowId']));
    } catch (Exception $e) { 
        echo $e->getMessage();
    }

}

$db->close();
?>
