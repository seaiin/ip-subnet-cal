import React, { Component } from 'react';
import AllPossibleTable from './AllPossibleTable';
import classNames from 'classnames';
import {
  convertToSubnet,
  networkClassSplit, 
  networkAddress, 
  broadcastAddress, 
  usableRange,
  numberOfHosts,
  wildCard,
  binaryMask,
  ipClass,
  isPrivate,
  ipHex,
  ipBinary,
  ipInt,
  isIPv4,
  getPossibleText,
  getAllPossible,
} from './utils/helper'

class App extends Component {
  state = {
    ip: '158.108.0.1',
    classIp: 'any',
    subnet: networkClassSplit('any'),
    mask: 32,
    changed: true,
    allPossible: [],
  }
  setClass = (e) => {
    this.setState({
      classIp: e.target.value,
      subnet: networkClassSplit(e.target.value),
      changed: true,
    });
  }
  onInputChange = (e) => {
    this.setState({
      ip: e.target.value,
      changed: true,
    });
  }
  onSelectChange = (e) => {
    this.setState({
      mask: e.target.value,
      changed: true,
    });
  }
  calculateIp = () => {
    const { ip, mask } = this.state;
    if(isIPv4(ip)){
      this.setState({
        changed: false,
        find: true,
        ipv4: ip,
        networkAddress: networkAddress(ip, mask),
        usableRange: usableRange(ip, mask),
        broadcast: broadcastAddress(ip, mask),
        totalHosts: numberOfHosts(ip, mask),
        usableHosts: numberOfHosts(ip, mask) - 2 > 0 ? numberOfHosts(ip, mask) - 2 : 0,
        subnetMask: convertToSubnet(mask),
        wildCard: wildCard(mask),
        binaryMask: binaryMask(mask),
        isPrivate: isPrivate(ip),
        ipBinary: ipBinary(ip),
        ipInt: ipInt(ip),
        ipHex: ipHex(ip),
        ipClass: ipClass(mask),
        allPossible: getAllPossible(ip, mask),
      })
    }
  }
  render() {
    const { classIp, ip, subnet } = this.state;
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="page-header">
                <h1>IP Subnet Calculator</h1>
              </div>
              <div className="input-field">
                <div className="form-group">
                  <label>IP Address</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={this.onInputChange}
                    value={ip}
                  />
                </div>
                <div className="form-group">
                  <label>Network Class</label>
                  <div></div>
                  <label className="radio-inline">
                    <input checked={classIp === 'any'} type="radio" value="any" name="class" onChange={this.setClass}/>
                    Any
                  </label>
                  <label className="radio-inline">
                    <input checked={classIp === 'a'} type="radio" value="a" name="class" onChange={this.setClass}/>
                    A
                  </label>
                  <label className="radio-inline">
                    <input checked={classIp === 'b'} type="radio" value="b" name="class" onChange={this.setClass}/>
                    B
                  </label>
                  <label className="radio-inline">
                    <input checked={classIp === 'c'} type="radio" value="c" name="class" onChange={this.setClass}/>
                    C
                  </label>
            </div>
            <div className="form-group">
              <label>Subnet</label>
              <select className="form-control" onChange={this.onSelectChange}>
                {
                  subnet.map((sub, index) => {
                    return (<option key={index} value={32 - index}>{sub}</option>)
                  })
                }
              </select>
            </div>
            <button
                className={classNames('btn', this.state.changed ? 'btn-success' : 'btn-default')}
                onClick={this.calculateIp}>
                Calculate{!this.state.changed && 'd!'}
              </button>
            </div>
            {
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <td>IP Address</td>
                    <td>{this.state.ipv4}</td>
                  </tr>
                  <tr>
                    <td>Network Address</td>
                    <td>{this.state.networkAddress}</td>
                  </tr>
                  <tr>
                    <td>Usable Host IP Range</td>
                    <td>{this.state.usableRange}</td>
                  </tr>
                  <tr>
                      <td>Broadcast Address</td>
                      <td>{this.state.broadcast}</td>
                  </tr>
                  <tr>
                      <td>Total Number of Hosts</td>
                      <td>{this.state.totalHosts}</td>
                  </tr>
                  <tr>
                      <td>Number of Usable Hosts</td>
                      <td>{this.state.usableHosts}</td>
                  </tr>
                  <tr>
                      <td>Subnet Mask</td>
                      <td>{this.state.subnetMask}</td>
                  </tr>
                  <tr>
                      <td>Wildcard Mask</td>
                      <td>{this.state.wildCard}</td>
                  </tr>
                  <tr>
                      <td>Binary Subnet Mask</td>
                      <td>{this.state.binaryMask}</td>
                  </tr>
                  <tr>
                      <td>IP Class</td>
                      <td>
                        {
                        this.state.ipClass === 'ANY' ?
                        'None' 
                        : 
                        this.state.ipClass
                        }
                      </td>
                  </tr>
                  <tr>
                      <td>CIDR Notation</td>
                      <td>/{this.state.mask}</td>
                  </tr>
                  <tr>
                      <td>IP Type</td>
                      <td>{this.state.isPrivate ? 'Private' : 'Public'}</td>
                  </tr>
                  <tr>
                      <td>Short</td>
                      <td>{this.state.ipv4}/{this.state.mask}</td>
                  </tr>
                  <tr>
                      <td>Binary ID</td>
                      <td>{this.state.ipBinary}</td>
                  </tr>
                  <tr>
                    <td>Integer ID</td>
                    <td>{this.state.ipInt}</td>
                  </tr>
                  <tr>
                    <td>Hex ID</td>
                    <td>{this.state.ipHex}</td>
                  </tr>
                </tbody>
               </table> 
            }
            {
              <div>
                <div className="page-header">
                  <h2>{getPossibleText(ip, this.state.mask)}</h2>
                </div>
                <AllPossibleTable allPossible={this.state.allPossible}/>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
