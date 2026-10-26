import argparse

from src.services.indexing_service import index_pdf


def main() -> None:
    parser = argparse.ArgumentParser(description="Index a PDF into Chroma.")
    parser.add_argument("path", help="Path to the PDF document")
    parser.add_argument("--chat-id", required=True, help="Chat ID for document isolation")
    args = parser.parse_args()

    count = index_pdf(args.path, args.chat_id)
    print(f"Indexed {count} chunks.")


if __name__ == "__main__":
    main()
