cd "$(dirname "$0")" || exit

# 判断是否安装了 Node
if ! type node >/dev/null 2>&1; then
	echo "未检测到 nodejs 环境，尝试使用homebrew安装..."
	# 检测homebrew是否存在
	if ! type brew >/dev/null 2>&1; then
		echo "未检测到 homebrew，无法完成安装，请安装 homebrew 后进行尝试 (https://brew.sh/)"
	else
		brew install node
        echo "node 安装完成，版本为: "
        node --version
	fi
else
    echo "检测到 NodeJS 环境，版本为："
    node -v
fi

if ! type git >/dev/null 2>&1; then
    echo "未检测到 git 环境，尝试使用 homebrew 安装..."
    # 检测 homebrew 是否存在
    if ! type brew >/dev/null 2>&1; then
        echo "未检测到 homebrew，请手动安装 homebrew 后进行尝试 (https://brew.sh/)"
    else 
        brew install git
        echo "git 安装完成，版本为: "
        git --version
    fi
else
    echo "检测到 git 环境，版本为："
    git --version
fi

if ! type pnpm >/dev/null 2>&1; then
    echo "未检测到 pnpm 环境，尝试启用 corepack"
    if ! type corepack >/dev/null 2>&1; then
        echo "未检测到 corepack，请安装 Node.js 后重试 (https://nodejs.org/en/download)"
    else 
        corepack enable
        corepack prepare pnpm@12.4.2 --activate
        echo "pnpm 安装完成，版本为: "
        pnpm --version
    fi
else
    echo "检测到 pnpm 环境，版本为："
    pnpm -v
fi
