---
Published: 'True'
SpecTag: 小工具
desc: >-
  [AI提示]一个检测 OpenAI Compatible 的 API站点是否可用的脚本。设置了输出
  max_tokens=1，以节约用量不过好像还是会返回完整的句子。已设置输出 Response，以手...
---
[[AI提示]](Gemini)

一个检测 OpenAI Compatible 的 API站点是否可用的脚本。  
设置了输出 max_tokens=1，以节约用量  
不过好像还是会返回完整的句子。

已设置输出 Response，以手动检查问题所在。

```python
# /// script
# dependencies = ["requests"]
# ///

import requests
import time

def check_openai_endpoint(base_url, api_key, test_model, timeout=30):
    """
    快速检测 OpenAI API 站点是否可用
    
    :param base_url: API 的基础地址 (例如: https://api.openai.com)
    :param api_key: 你的 API Key
    :param timeout: 超时时间（秒），默认 3 秒以保证检测速度
    """
    # 处理 URL 格式，确保正确指向 /v1/models
    base_url = base_url.rstrip('/')
    if not base_url.endswith('/v1'):
        base_url = f"{base_url}/v1"
    
    url = f"{base_url}/models"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    print(f"👉 [1/2] 正在检测 /v1/models (鉴权验证)...")
    
    try:
        # 记录开始时间以计算延迟
        start_time = time.time()
        
        # 发起 GET 请求
        response = requests.get(url, headers=headers, timeout=timeout)
        
        # 计算响应时间 (毫秒)
        latency = (time.time() - start_time) * 1000 

        if response.status_code == 200:
            print(f"✅ 状态: 可用 | 延迟: {latency:.2f} ms")
        elif response.status_code == 401:
            print(f"⚠️ 状态: 网络连通，但 API Key 无效 (401 Unauthorized) | 延迟: {latency:.2f} ms")
            return
        else:
            print(f"❌ 状态: 异常 | 状态码: {response.status_code} | 错误信息: {response.text}")
            return

    except requests.exceptions.Timeout:
        print(f"❌ 状态: 连接超时 (超过 {timeout} 秒)。站点可能被墙或已失效。")
        return
    except requests.exceptions.RequestException as e:
        print(f"❌ 状态: 连接失败 | 错误详情: {e}")
        return

    print("-" * 50)
    chat_url = f"{base_url}/chat/completions"
    print(f"👉 [2/2] 正在检测 /v1/chat/completions (测试模型: {test_model})...")
    
    # 极简 Payload：只发个 "hi"，并限制最大生成 1 个 token，追求极致速度
    payload = {
        "model": test_model,
        "messages": [{"role": "user", "content": "hi"}],
        "max_tokens": 1 
    }
    
    try:
        t1 = time.time()
        res_chat = requests.post(chat_url, headers=headers, json=payload, timeout=timeout)
        latency_chat = (time.time() - t1) * 1000
        
        print(res_chat.json())

        if res_chat.status_code == 200:
            print(f"   ✅ 状态: 可用 | 延迟: {latency_chat:.2f} ms")
            print(f"   🎉 恭喜，该站点与 API Key 完全健康可用！\n")
        elif res_chat.status_code == 404:
            print(f"   ⚠️ 状态: 模型不存在 (404) | 延迟: {latency_chat:.2f} ms")
            print(f"   💡 提示: 站点正常，但可能不支持 '{test_model}' 模型，请更换模型名称重试。\n")
        elif res_chat.status_code == 429:
            print(f"   ⚠️ 状态: 触碰速率限制或额度耗尽 (429) | 延迟: {latency_chat:.2f} ms\n")
        else:
            print(f"   ❌ 状态: 生成异常 (HTTP {res_chat.status_code}) | 延迟: {latency_chat:.2f} ms")
            print(f"   🔍 错误信息: {res_chat.text[:150]}\n")
            
    except requests.exceptions.Timeout:
         print(f"   ❌ 状态: 对方处理超时 (超过 {timeout} 秒)。可能是上游负载过高。\n")
    except Exception as e:
        print(f"   ❌ 请求失败: {e}\n")

# ================= 使用示例 =================
if __name__ == "__main__":
    # 替换为你要测试的 API 地址（支持官方和第三方中转）
    # 例如: "https://api.openai.com" 或 "https://api.your-proxy.com"
    TEST_URL = "xxxx" 

    # 替换为你的 API Key
    TEST_KEY = "sk-xxx" 
    check_openai_endpoint(TEST_URL, TEST_KEY, "xxxx")
```

使用了 uv 的内嵌依赖标注。无需手动安装依赖即可运行。

```bash
uv run test_api.py
```

