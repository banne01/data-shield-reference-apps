#!/bin/bash

function check_driver {
    if [[ ! -e /sys/module/isgx/version ]] ; then
        echo "SGX driver is already not installed"
        exit 1
    fi
}

function uninstall {
    # Uninstall PSW
    os=$(awk -F= '/^PRETTY_NAME/{print $2}' /etc/os-release)
    if [[ $os =~ "Ubuntu" ]]; then
        cd /
        sudo apt-get remove *sgx* -y
        cd -
    elif [[ $os =~ "Red Hat" ]]; then
        yum remove *sgx*
    fi

    echo "PSW uninstalled"

    # Uninstall SGX driver
    if [ -f "./opt/intel/sgxdriver/uninstall.sh" ]; then
        bash /opt/intel/sgxdriver/uninstall.sh 
    else
        sudo service aesmd stop
        sudo /sbin/modprobe -r isgx
        sudo rm -rf "/lib/modules/"`uname -r`"/kernel/drivers/intel/sgx"
        sudo /sbin/depmod
        sudo /bin/sed -i '/^isgx$/d' /etc/modules
    fi

    ls /dev/isgx >/dev/null 2>1 && echo "SGX driver uninstall failed" || echo "SGX driver uninstalled"
}

check_driver
uninstall
