from pipeline.describe import describe
import ollama

def test_returns_the_content_string(monkeypatch):
    def fake_chat(*args, **kwargs):
        from ollama import ChatResponse, Message
        return ChatResponse(message=Message(role="assistant", content="a drawing of a heap"))
    monkeypatch.setattr(ollama, "chat", fake_chat)

    result = describe("fake.png")
    assert result == "a drawing of a heap"