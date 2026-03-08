# Payment service for subscription handling

def process_payment(user_id: int, plan: str):
    # TODO: Integrate with payment gateway
    return {"status": "success"}


# PaymentService class - services/__init__.py ke liye
class PaymentService:
    @staticmethod
    def process(user_id: int, plan: str):
        return process_payment(user_id, plan)