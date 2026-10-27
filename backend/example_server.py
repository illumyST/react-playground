from __future__ import annotations

import os
from pathlib import Path

from copilotkit import Action, CopilotKitRemoteEndpoint
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from dotenv import load_dotenv
from fastapi import FastAPI
from openai import OpenAI


repo_root = Path(__file__).resolve().parents[1]
env_file = '.env.production' if os.getenv('NODE_ENV') == 'production' else '.env.development'
load_dotenv(repo_root / 'env' / env_file)

app = FastAPI()


def build_client() -> OpenAI:
    api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_GENERATIVE_AI_API_KEY')
    if not api_key:
        raise RuntimeError(
            'GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is not set. '
            'Update env/.env.development before starting Highcharts Copilot backend.'
        )

    return OpenAI(
        api_key=api_key,
        base_url='https://generativelanguage.googleapis.com/v1beta/openai/',
    )


async def chat_with_gemini(messages: list[dict]):
    client = build_client()
    return client.chat.completions.create(
        model=os.getenv('COPILOTKIT_MODEL', 'gemini-2.5-flash'),
        messages=messages,
        stream=True,
    )


sdk = CopilotKitRemoteEndpoint(
    actions=[
        Action(
            name='chat',
            description='Chat with Gemini via OpenAI-compatible endpoint',
            parameters=[
                {
                    'name': 'messages',
                    'type': 'array',
                    'description': 'Chat messages',
                    'required': True,
                }
            ],
            handler=chat_with_gemini,
        )
    ]
)

add_fastapi_endpoint(app, sdk, '/copilotkit')


@app.get('/')
def health_check():
    return {'message': 'Copilot backend is running'}