import datetime
import traceback

from fastapi import APIRouter

# Create router instance
router = APIRouter(prefix="/api/error-management", tags=["error-management"])


def handle_error_details(
    error, context=None, include_traceback=True, additional_info=None
):
    """Process and format error details with optional context and traceback.

    Args:
        error: The exception object to process.
        context: Optional context information (default: None).
        include_traceback: Whether to include the traceback (default: True).
        additional_info: Additional information related to the error
            (default: None).

    Returns:
        dict: A dictionary containing the formatted error details.
    """
    error_data = {
        "error_type": type(error).__name__,
        "error_message": str(error),
        "timestamp": datetime.datetime.now().isoformat(),
        "context": context,
        "traceback": (
            (traceback.format_exc()
             if include_traceback
             else "Traceback suppressed.")
        ),
        "additional_info": additional_info,
    }
    return error_data
