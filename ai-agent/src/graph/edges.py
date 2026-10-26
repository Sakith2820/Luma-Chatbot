from src.domain.schemas import GraphState


def route_question(state: GraphState) -> str:
    return "retrieve_context" if state.use_retrieval else "generate_answer"
