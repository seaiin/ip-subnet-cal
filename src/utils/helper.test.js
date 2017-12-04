import { expect } from 'chai';
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
} from './helper';

describe('test convertTosubnet', () => {
  it('should convert to subnet', () => {
    expect(convertToSubnet(1)).to.equal('128.0.0.0');
    expect(convertToSubnet(2)).to.equal('192.0.0.0');
    expect(convertToSubnet(24)).to.equal('255.255.255.0');
    expect(convertToSubnet(15)).to.equal('255.254.0.0');
  })
})

describe('test network class split', () => {
  it('should show array of subnet', () => {
    const expectedValued = [
      `${convertToSubnet(32)} / 32`,
      `${convertToSubnet(31)} / 31`,
      `${convertToSubnet(30)} / 30`,
      `${convertToSubnet(29)} / 29`,
      `${convertToSubnet(28)} / 28`,
      `${convertToSubnet(27)} / 27`,
      `${convertToSubnet(26)} / 26`,
      `${convertToSubnet(25)} / 25`,
      `${convertToSubnet(24)} / 24`,
    ]
    const value = networkClassSplit('c');
    value.map((subnet, index) => {
      expect(subnet).to.equal(expectedValued[index]);
    })
  })
})

describe('test network address', () => {
  it('should show network address', () => {
    expect(networkAddress('178.233.14.6', 29)).to.equal('178.233.14.0');
    expect(networkAddress('178.233.14.96', 28)).to.equal('178.233.14.96');
    expect(networkAddress('178.233.14.53', 28)).to.equal('178.233.14.48');
    expect(networkAddress('178.233.14.53', 21)).to.equal('178.233.8.0');
  })
})

describe('test broadcast address', () => {
  it('should show broadcast address', () => {
    expect(broadcastAddress('178.233.14.6', 29)).to.equal('178.233.14.7');
    expect(broadcastAddress('178.233.14.96', 28)).to.equal('178.233.14.111');
    expect(broadcastAddress('178.233.14.53', 28)).to.equal('178.233.14.63');
    expect(broadcastAddress('178.233.14.53', 21)).to.equal('178.233.15.255');
  })
})

describe('test usable host ip range', () => {
  it('should show range of usable host ip', () => {
    expect(usableRange('158.108.12.34', 24)).to.equal('158.108.12.1 - 158.108.12.254');
    expect(usableRange('158.108.12.34', 15)).to.equal('158.108.0.1 - 158.109.255.254');
    expect(usableRange('255.10.98.12', 28)).to.equal('255.10.98.1 - 255.10.98.14');
    expect(usableRange('255.10.98.12', 8)).to.equal('255.0.0.1 - 255.255.255.254');
  })
})

describe('test number of hosts', () => {
  it('should show number of hosts', () => {
    expect(numberOfHosts('255.10.98.12', 16)).to.equal(65536);
    expect(numberOfHosts('255.10.98.12', 20)).to.equal(4096);
    expect(numberOfHosts('178.234.92.1', 31)).to.equal(2);
    expect(numberOfHosts('255.10.98.12', 32)).to.equal(1);
  })
})

describe('test wildcard mask', () => {
  it('should show wildcard mask', () => {
    expect(wildCard(31)).to.equal('0.0.0.1');
    expect(wildCard(16)).to.equal('0.0.255.255');
    expect(wildCard(5)).to.equal('7.255.255.255');
  })
})

describe('test binary subnet mask', () => {
  it('should show binary subnet mask', () => {
    expect(binaryMask(24)).to.equal('11111111.11111111.11111111.00000000');
    expect(binaryMask(1)).to.equal('10000000.00000000.00000000.00000000');
    expect(binaryMask(8)).to.equal('11111111.00000000.00000000.00000000');
    expect(binaryMask(32)).to.equal('11111111.11111111.11111111.11111111');
  })
})

describe('test ip class', () => {
  it('should show ip class', () => {
    expect(ipClass(1)).to.equal('ANY');
    expect(ipClass(8)).to.equal('A');
    expect(ipClass(17)).to.equal('B');
    expect(ipClass(27)).to.equal('C');
  })
})

describe('test private ip', () => {
  it('should show ip type public/private', () => {
    expect(isPrivate('11.101.11.1')).to.equal(false);
    expect(isPrivate('10.101.11.1')).to.equal(true);
    expect(isPrivate('172.16.23.222')).to.equal(true);
    expect(isPrivate('192.192.192.192')).to.equal(false);
  })
})

describe('test Hex IP', () => {
  it('should show Hex IP', () => {
    expect(ipHex('11.101.11.1')).to.equal('b650b01');
    expect(ipHex('177.7.7.77')).to.equal('b107074d');
    expect(ipHex('158.108.0.0')).to.equal('9e6c0000');
    expect(ipHex('255.255.22.22')).to.equal('ffff1616');
  })
})