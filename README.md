# erc6551demo

## 準備

Git Cloneをします。

```sh
git clone https://github.com/tnakagawa/erc6551demo.git
```

`erc6551demo`フォルダをVSCodeで開きます。

以下のコマンドで、Node関連のインストールを行います。

```sh
npm install
```

## ローカルノード起動

以下のコマンドで、ローカルノードを起動します。

```sh
npx hardhat node
```

## デプロイ

別のターミナルを開きます。
以下のコマンドで`localhost`にデプロイをします。

```sh
npx hardhat ignition deploy .\ignition\modules\ERC6551Demo.js --network localhost
```

## ERC6551

ターミナルの環境変数にネットワークが`localhost`であることを設定します。

PowerShellの場合は以下のコマンドです。

```sh
$env:HARDHAT_NETWORK="localhost"
```

Window Shellの場合は以下のコマンドです。

```sh
set HARDHAT_NETWORK=localhost
```

### アカウント作成

以下のコマンドでERC6551のアカウントを作成します。

```sh
node .\scripts\createAccount.js
```

結果：例

アカウントが作成されます。

```sh
createAccount
account 0x9A4d8D916Ea34345B55Fe04E6B0B5b18461B7223
```

### ERC721のmint

以下のコマンドでERC721を`signer1`にmintします。

```sh
node .\scripts\erc721mint.js
```

結果：例

`signer1`にトークンID`1`をmintします。

```sh
mint 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1
ownerOf 1 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

### ERC20のmint

以下のコマンドでERC20をaccountにmintします。

```sh
node .\scripts\erc20mint.js 
```

結果：例

`account`に`100.0 DTC`をmintします。

```sh
mint 0x9A4d8D916Ea34345B55Fe04E6B0B5b18461B7223 100.0 DTC
ERC20Demo#balanceOf 0x9A4d8D916Ea34345B55Fe04E6B0B5b18461B7223 100.0 DTC
```

### 状態の確認

以下のコマンドで状態を確認します。

```sh
node .\scripts\info.js
```

結果：例

`account`にERC20を`100.0 DTC`保持していることがわかります。

```sh
        | address                                    | ERC20
signer1 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0.0
signer2 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0.0
account | 0x9A4d8D916Ea34345B55Fe04E6B0B5b18461B7223 | 100.0
----------------------------------------------------------------------
Create  | true
ERC721  | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1n
```

### Execute

`account`から`signer1`へERC20を`1.0 DTC`移転します。

```sh
node .\scripts\execute.js
```

### 状態の確認

以下のコマンドで状態を確認します。

```sh
node .\scripts\info.js
```

結果：例

`account`から`signer1`へERC20を`1.0 DTC`移転していることがわかります。

```sh
        | address                                    | ERC20
signer1 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 1.0
signer2 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0.0
account | 0x9A4d8D916Ea34345B55Fe04E6B0B5b18461B7223 | 99.0
----------------------------------------------------------------------
Create  | true
ERC721  | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1n
```

**以上**