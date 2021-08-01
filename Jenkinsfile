pipeline {
    agent any
    environment {
        KOPS_HOME = tool name: 'kops', type:'com.cloudbees.jenkins.plugins.customtools.CustomTool'
        KUBECTL_HOME = tool name: 'kubectl', type:'com.cloudbees.jenkins.plugins.customtools.CustomTool'
    }
    stages {
        stage('store_build') {
            steps {
                git branch: 'containerized', url:'https://github.com/eshop-micro-demo/ui.git'
                script {
                    docker.withRegistry('https://quay.io', 'quay.io-login') {
                      def checkoutImg = docker.build('quay.io/microshop/ui:latest').push()
                    }
                }
            }
        }
        stage('k8s_deploy') {
            steps {
                sh """#! /bin/bash
                  set -x
                  #ls -ltr
                  export PATH=$PATH:$KOPS_HOME:$KUBECTL_HOME
                  #which kubectl
                  #which kops
                  kops export kubecfg ${CLUSTER_NAME} --kubeconfig ./kops_kubeconfig --admin
                  export KUBECONFIG=./kops_kubeconfig
                  kubectl create ns microshop || true
                  kubectl apply -n microshop -f k8s-deployment.yaml
                """
            }
        }
    }
}
