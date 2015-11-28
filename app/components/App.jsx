import React from 'react';
import $ from 'jquery';

require('./App.css');

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            results: [],
            page: 1
        };
    }

    componentDidMount () {
        this.fetchDate()
    }

    fetchDate(page=1, limit=30){
        let url = 'https://leancloud.cn:443/1.1/classes/FeedBack?limit={limit}&skip={skip}&order=-updatedAt&&';
        $.ajax({
            type: "GET",
            url: url.replace('{skip}', (page-1)*limit).replace('{limit}', limit),
            headers: {
                'X-LC-Id': '7hyoc6are05n823dd424ywvf752gem2w96inlkl3yiann6vw',
                'X-LC-Key': 'tgufkdybjtb4gvsbwcatiwd9wx49adxrmf8qkpwunh0h3wx3'
            },
            processData: false,
            success: function(data) {
                console.log(data)
                console.log(this)
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

    render () {
        return(
            <div className="app-container">
                <h1>编程助手用户反馈跟踪 <small>v0.1</small></h1>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>类型</th>
                            <th>状态</th>
                            <th>应用版本</th>
                            <th>系统版本</th>
                            <th>手机型号</th>
                            <th>反馈内容</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.results.map(function(item) {
                            let statusLabel = 'label label-success';
                            if(item.status === 'close'){
                                statusLabel = 'label label-danger';
                            }
                            if(item.status === 'pedding'){
                                statusLabel = 'label label-warning';
                            }

                            return (
                                <tr key={item.objectId}>
                                    <td >{item.type === 'report'
                                            ? '反馈'
                                            : "建议"}</td>
                                    <td className={statusLabel}>{item.status}</td>
                                    <td >{item.app_version}</td>
                                    <td >{item.system_version}</td>
                                    <td >{item.model}</td>
                                    <td alt={item.content}>{item.content.substring(0, 20)}</td>
                                </tr>
                            )
                        })}
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
            </div>
        );
    }
}
