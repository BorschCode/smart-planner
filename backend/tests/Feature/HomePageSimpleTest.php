<?php

it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(\Symfony\Component\HttpFoundation\Response::HTTP_OK);
});
