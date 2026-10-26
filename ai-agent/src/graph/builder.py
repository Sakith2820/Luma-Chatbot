from langgraph.graph import END, START, StateGraph

from src.domain.schemas import GraphState
from src.graph.edges import route_question
from src.graph.nodes import generate_answer, prepare_question, retrieve_context


def build_chat_graph():
    graph = StateGraph(GraphState)
    graph.add_node("prepare_question", prepare_question)
    graph.add_node("retrieve_context", retrieve_context)
    graph.add_node("generate_answer", generate_answer)
    graph.add_edge(START, "prepare_question")
    graph.add_conditional_edges(
        "prepare_question",
        route_question,
        {
            "retrieve_context": "retrieve_context",
            "generate_answer": "generate_answer",
        },
    )
    graph.add_edge("retrieve_context", "generate_answer")
    graph.add_edge("generate_answer", END)
    return graph.compile()
