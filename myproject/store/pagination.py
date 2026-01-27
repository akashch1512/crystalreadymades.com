from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

class SkipLimitPagination(LimitOffsetPagination):
    default_limit = 100
    limit_query_param = 'limit'
    offset_query_param = 'skip'

    def get_paginated_response(self, data):
        # CRITICAL FIX: Return the raw list 'data' instead of 
        # the default dictionary { count: x, results: data }
        return Response(data)