const typeDict = {
    any: 1,
    a: 8,
    b: 16,
    c: 24
}

const binaryToDecimal = binary =>
    [0, 0, 0, 0].map((zero, index) => parseInt(binary.substr(index * 8, 8), 2)).join('.');

const decimalIpToBinary = ip =>
    ip.split('.')
    .map(ipChar => '0'.repeat(8 - (+ipChar).toString(2).length) + (+ipChar).toString(2))
    .join('');

export const decimalToBinary = decimal =>
    '0'.repeat(32 - decimal.toString(2).length) + decimal.toString(2)

const binaryToIp = binary =>
    [0, 0, 0, 0].map((zero, index) => binary.substr(index * 8, 8), 2).join('.');

const binaryAddition = (a, b) =>
    (parseInt(a, 2) + parseInt(b, 2)).toString(2);

const binarySubtraction = (a, b) =>
    (parseInt(a, 2) - parseInt(b, 2)).toString(2);

const fillZero = (a) =>
    Array(32 - a.length + 1)
    .join('0')
    + a;

export const convertToSubnet = (subnet) =>
    binaryToDecimal(((0xffffffff << (32 - subnet)) >>> 0)
    .toString(2));


export const networkClassSplit =  (type) => {
     const subnet = new Array(32 - typeDict[type] + 1).fill(0);
     return subnet.map((s, index) => `${convertToSubnet(index+typeDict[type])} / ${index+typeDict[type]}`
    ).reverse();
}

export const networkAddress = (ip, subnet) =>
    binaryToDecimal(((parseInt(decimalIpToBinary(ip), 2) & ((0xffffffff << (32 - subnet)) >>> 0)) >>> 0)
    .toString(2));


export const broadcastAddress = (ip, subnet) =>
    binaryToDecimal(((parseInt(decimalIpToBinary(networkAddress(ip, subnet)), 2) 
    | ~((0xffffffff << (32 - subnet)))) >>> 0)
    .toString(2));

export const usableRange = (ip, subnet) => {
    if (networkAddress(ip, subnet) === broadcastAddress(ip, subnet)) {
        return 'None'
    }
    return binaryToDecimal(binaryAddition(decimalIpToBinary(networkAddress(ip, subnet)), '1'))
            + ' - '
            + binaryToDecimal(binarySubtraction(decimalIpToBinary(broadcastAddress(ip, subnet)), '1'))
}

export const numberOfHosts = (ip, subnet) =>
    parseInt(binarySubtraction(decimalIpToBinary(broadcastAddress(ip, subnet)), decimalIpToBinary(networkAddress(ip, subnet))), 2) + 1

export const wildCard = (subnet) => 
    binaryToDecimal(fillZero((~(0xffffffff << (32 - subnet)) >>> 0)
    .toString(2)));

export const binaryMask = (subnet) =>
    binaryToIp(fillZero(((0xffffffff << (32 - subnet)) >>> 0)
    .toString(2)))

export const ipClass = (subnet) => {
    let classIp = ''
    Object.keys(typeDict).map((type) => {
        if (typeDict[type] <= subnet) {
             classIp = type;
        }
        return type;
    })
    return classIp.toUpperCase();
}

export const decimalIp = ip => parseInt(decimalIpToBinary(ip), 2);

export const isPrivate = (ip) => {
    let ipDec = parseInt(decimalIpToBinary(ip), 2);
    const privateLength = {
        a: {
            start: '10.0.0.0',
            end: '10.255.255.255',
          },
          b: {
            start: '172.16.0.0',
            end: '172.31.255.255',
          },
          c: {
            start: '192.168.0.0	',
            end: '192.168.255.255',
          },
        }
    return ['a', 'b', 'c'].reduce((prev, curr) => {
        if (ipDec >= parseInt(decimalIpToBinary(privateLength[curr].start), 2) &&
            ipDec <= parseInt(decimalIpToBinary(privateLength[curr].end), 2)) {
                prev = true;
            }
            return prev;
        }, false);
}

export const ipHex = (ip) => 
    parseInt(decimalIpToBinary(ip), 2).toString(16)

export const ipBinary = (ip) =>
    decimalIpToBinary(ip)

export const ipInt = (ip) =>
    parseInt(ipBinary(ip), 2)

export const isIPv4 = (ip) => {
    const regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
    }

const generatePossible = (decimalIp, jump) => {
    const plus = (2 ** jump) - 1;
    const usableHost = {
        start: binaryToDecimal(decimalToBinary(decimalIp + 1)),
        end: binaryToDecimal(decimalToBinary(decimalIp + plus - 1)),
    }
    const data = {
        netAddress: binaryToDecimal(decimalToBinary(decimalIp)),
        broadcast: binaryToDecimal(decimalToBinary(decimalIp + plus)),
        usableHost,
        next: decimalIp + plus + 1,
    }
    return data;
    }

const checkClassToFix = (classIp) => {
    if(classIp === 'A') {
      return 9;
    } else if(classIp === 'B') {
      return 17;
    } else if(classIp === 'C') {
      return 25;
    }
    return 0;
}

export const getPossibleText = (ip, subnet) => {
    const classIp = ipClass(subnet);
    const checker = {
      'ANY': 0,
      'A': 1,
      'B': 2,
      'C': 3,
    };
    const ipCut = ip
    .split('.')
    .map((ip, index) => index < checker[classIp] ? ip : '*')
    .join('.');
    return `All Possible /${subnet} Networks for ${ipCut}`;
  }

export const getAllPossible = (ip, mask) => {
    const classIp = ipClass(mask);
    const binaryIp = decimalIpToBinary(ip);
    const fixDot = checkClassToFix(classIp);
    const binaryFix = binaryIp
    .split('')
    .map((bit, index) => index + 1 < fixDot ? bit : '0')
    .join('');
    const binaryFixMax = binaryIp
    .split('')
    .map((bit, index) => index + 1 < fixDot ? bit : '1')
    .join('');
    const allPossible = [];
    let decimalbinaryFix = parseInt(binaryFix, 2);
    const decimalbinaryFixMax = parseInt(binaryFixMax, 2);
    while(decimalbinaryFix <= decimalbinaryFixMax) {
      const data = generatePossible(decimalbinaryFix, 32 - mask);
      allPossible.push(data);
      decimalbinaryFix = data.next;
    }
    return allPossible;
}