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

    public function update($tab, $rowId,  $data) {
        extract($data);
        $sql = $rowId < 0 
            ? "INSERT INTO `$tab` (`left`,`right`) VALUES ('$left' ,'$right')"
            : "UPDATE `$tab` SET `left` = '$left', `right`='$right' WHERE id=$rowId";
        
        $this->query($sql);
        return array($this->error, json_encode($data), $sql);
    }

    public function updateRel($tab, $rowId, $data) {
        $numRows= mysqli_num_rows($this->query("SELECT * FROM `$tab` WHERE id=$rowId"));

        if ($numRows)  {
            $this->query($sql = "UPDATE `$tab` SET `rel` = '" . $data . "' WHERE id=$rowId");
        } else {
            $this->query($sql = "INSERT INTO `$tab` (`id`, `rel`) VALUES ($rowId, '" . $data . "')");
        }
        return array($this->error, $sql, $numRows);
    }


    public function getAll($table, $rel) {
        $out = array();

        if ($res = $this->query($sql = "SELECT * FROM $table"))
            while( $obj = $res->fetch_object() )
                $out[$obj->id] = $rel ? json_decode($obj->rel) : $obj;

        return $out;
    }
}
ini_set('error_reporting', 1);
$db = new db('kodemaistercom.ipagemysql.com', 'club', 'club_99','club');

$action = $_GET['action'];
$tab    = $_GET['table'];
$rowId  = intval($_GET['rowId']);
$rel    = isset($_GET['rel']);

if ($action == 'get' ) {
    echo json_encode($db->getAll($tab, $rel));
} elseif ($action == 'post') {
    $ret = $rel ? $db->updateRel($tab, $rowId, json_encode($_POST))
                : $db->update(   $tab, $rowId, $_POST);

    echo json_encode(array($ret, $_POST, $_GET['rowId']));
}

$db->close();
?>
