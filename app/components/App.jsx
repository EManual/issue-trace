'use strict'
import React from 'react'
import $ from 'jquery'
import LoginDialog from './LoginDialog.jsx'
import config from './config.js'

require('./App.css');

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            results: [],
            page: 1,
            sessionToken: '',
            showLoginDialog: false
        };
    }

    componentDidMount () {
        this.fetchDate()
    }

    fetchDate(page=1, limit=30){
        let url = 'https://leancloud.cn:443/1.1/classes/FeedBack?limit={limit}&skip={skip}&order=-createdAt&&';
        $.ajax({
            type: "GET",
            url: url.replace('{skip}', (page-1)*limit).replace('{limit}', limit),
            headers: {
                'X-LC-Id': config.APP_ID,
                'X-LC-Key': config.APP_KEY
            },
            processData: false,
            success: function(data) {
                this.setState({
                    results: data.results,
                    page: page
                })
            }.bind(this)
        });
    }

    previousPage(){
        if(this.state.page == 1){
            return;
        }
        this.fetchDate(this.state.page-1);
    }

    nextPage() {
        this.fetchDate(this.state.page+1);
    }
    /**
     * 登陆
     * @return {[type]} [description]
     */
    clickLogin() {
        if(this.state.sessionToken !== ''){
            this.setState({
                sessionToken: ''
            })
        }else{
            this.setState({
                showLoginDialog: true
            })
        }

    }
    /**
     * 登录成功回调
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    loginSuccessCallback(data){
        this.setState({
            sessionToken: data.sessionToken,
            showLoginDialog: false
        })
    }
    /**
     * 选择
     * @param  {string} item 一条记录
     * @param  {[type]} evt  时间
     * @return {[type]}      [description]
     */
    handleSelectChange(item, evt) {

        let url = 'https://leancloud.cn:443/1.1/classes/FeedBack/{objectId}'
        let data = {
            status: evt.target.value
        }

        $.ajax({
            type: "PUT",
            url: url.replace('{objectId}', item.objectId),
            headers: {
                'X-LC-Id': config.APP_ID,
                'X-LC-Key': config.APP_KEY,
                'X-LC-Session': this.state.sessionToken,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(data) {
                this.fetchDate(this.state.page)
                // alert('修改成功!')
            }.bind(this),
            error: function(err, code){
                alert('操作失败')
            }
        });

    }

    render () {
        return(
            <div className="app-container">
                <h1>编程助手用户反馈跟踪</h1>
                <button className="btn btn-primary" onClick={this.clickLogin.bind(this)}>{this.state.sessionToken === ''?'登录':'退出'}</button>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>类型</th>
                            <th>状态</th>
                            <th>版本</th>
                            <th>系统</th>
                            <th>手机</th>
                            <th>创建于</th>
                            <th>反馈</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.results.map(function(item) {
                            let statusItem = item.status;
                            let statusLabel = 'label label-success';
                            let createdAt = new Date(item.createdAt);
                            
                            if(item.status === 'close'){
                                statusLabel = 'label label-danger';
                            }
                            if(item.status === 'pedding'){
                                statusLabel = 'label label-warning';
                            }
                            if( this.state.sessionToken !== '' ){
                                statusItem = (
                                    <select className="form-control" onChange={this.handleSelectChange.bind(this, item)} value={item.status}>
                                        <option value="open">open</option>
                                        <option value="close">close</option>
                                        <option value="pedding">pedding</option>
                                    </select>
                                )
                            }
                            return (
                                <tr key={item.objectId}>
                                    <td style={{minWidth: '70px'}}>{item.type === 'report'
                                            ? '反馈'
                                            : "建议"}</td>
                                        <td style={{minWidth: '83px'}} className={statusLabel}>{statusItem}</td>
                                    <td >{item.app_version}</td>
                                    <td >{item.system_version}</td>
                                    <td >{item.model}</td>
                                    <td style={{minWidth: '100px'}} >{createdAt.getUTCFullYear()+"-"+(createdAt.getUTCMonth()+1)+"-"+createdAt.getUTCDate()}</td>
                                    <td alt={item.content}>{item.content}</td>
                                </tr>
                            )
                        }.bind(this))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pager">
                        <li onClick={this.previousPage.bind(this)}>
                            <a>上一页</a>
                        </li>
                        <li style={{marginLeft: '10px',marginRight: '10px'}}>
                            {this.state.page}
                        </li>
                        <li onClick={this.nextPage.bind(this)}>
                            <a>下一页</a>
                        </li>
                    </ul>
                </nav>

                <LoginDialog show={this.state.showLoginDialog} loginSuccessCallback={this.loginSuccessCallback.bind(this)}/>
            </div>
        );
    }
}
