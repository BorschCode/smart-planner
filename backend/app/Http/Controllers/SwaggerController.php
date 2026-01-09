<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

class SwaggerController extends Controller
{
    // Serve Swagger UI HTML
    public function ui()
    {
        return response()->view('swagger.index');
    }

    // Serve openapi.yaml
    public function spec()
    {

        $path = base_path('docs/openapi.yaml');

        if (! File::exists($path)) {
            abort(Response::HTTP_NOT_FOUND, 'openapi.yaml not found');
        }

        return response(File::get($path), Response::HTTP_OK, [
            'Content-Type' => 'application/yaml',
        ]);
    }
}
