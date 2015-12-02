'use strict';
import React from 'react';
import $ from 'jquery';

//不优雅
const APP_ID = '7hyoc6are05n823dd424ywvf752gem2w96inlkl3yiann6vw';
const APP_KEY = 'tgufkdybjtb4gvsbwcatiwd9wx49adxrmf8qkpwunh0h3wx3'

export default class LoginDialog extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            show: false || this.props.show,
            loginSuccessCallback: this.props.loginSuccessCallback,
            incorrectPassword: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: false || nextProps.show,
            incorrectPassword: false
        })
    }

    clickClose() {
        this.setState({
            show: false
        })
    }

    clickLogin() {
        let url = 'https://leancloud.cn:443/1.1/login?username={username}&password={password}'

        let username = this.refs.inputName.value;
        let password = this.refs.inputPassword.value;

        console.log(username)
        console.log(password)

        $.ajax({
            type: "GET",
            url: url.replace('{username}', username).replace('{password}', password),
            headers: {
                'X-LC-Id': APP_ID,
                'X-LC-Key': APP_KEY
            },
            processData: false,
            success: function(data) {
                if(this.props.loginSuccessCallback){
                    this.props.loginSuccessCallback(data)
                }
                this.clickClose();
                this.setState({
                    incorrectPassword: false
                })

            }.bind(this),
            error: function(err_response){
                console.log(err_response)
                if(err_response.status && err_response.responseJSON && err_response.responseJSON.code === 211){
                    this.setState({
                        incorrectPassword: true
                    })
                }
            }.bind(this)
        });
    }

    render() {
        return (
            <div className="modal fade in" style={{display: this.state.show?"block":"none"}}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">用户登录</h4>
                  </div>
                  <div className="modal-body">
                      <form>
                        <div class="form-group">
                          <label for="recipient-name" className="control-label">用户名:</label>
                          <input type="text" className="form-control" ref="inputName" />
                        </div>
                        <div className={"form-group " + (this.state.incorrectPassword?'has-error has-feedback' : '')}>
                          <label className="control-label" >密码:</label>
                          <input type="pawword" className="form-control" ref="inputPassword"/>
                          <span className="glyphicon glyphicon-remove form-control-feedback"></span>
                        </div>
                      </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" onClick={this.clickClose.bind(this)}>关闭</button>
                    <button type="button" className="btn btn-primary" onClick={this.clickLogin.bind(this)}>确认</button>
                  </div>

                </div>
              </div>
            </div>
        )
    }
}
