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

    def get_info(self) -> str:
        """Get the information about the thing.

        Raises:
            NotImplementedError: Raised when the method is not implemented.

        Returns:
            str: A string containing information about the thing.
        """
        raise NotImplementedError

    def __str__(self) -> str:
        return self.get_info()
