"""
The thing module.
"""
import uuid


class Thing:
    """
    Abstract class for things
    """

    def __init__(self) -> None:
        self._uuid = uuid.uuid4()
