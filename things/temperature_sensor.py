"""
Temperature sensor class.
"""
import random

from thing import Thing


class TemperatureSensor(Thing):
    """
    Represents a temperature sensor.
    """
    _precision: int = 2
    _minimum: float = -20.0
    _maximum: float = 40.0

    _value: float = float("nan")

    def value(self) -> float:
        """Get the value of the temperature sensor

        Returns:
            float: The value of the temperature sensor
        """
        return self._value

    async def _update(self) -> None:
        self._value = await self._read_value()

    async def _read_value(self) -> float:
        """
        Simulate reading the value of the temperature sensor.
        """
        return round(random.uniform(self._minimum, self._maximum), self._precision)

    def get_info(self) -> str:
        """
        Get information about the temperature sensor.
        """
        return "Temperature sensor 9000"
