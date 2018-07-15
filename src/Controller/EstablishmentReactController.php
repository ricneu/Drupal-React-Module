<?php

namespace Drupal\establishment_react\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Controller routines for Establishment React routes.
 */
class EstablishmentReactController extends ControllerBase
{

    /**
     * {@inheritdoc}
     */
    protected function getModuleName()
    {
        return 'establishment_react';
    }

    /**
     * Generate a render array with our templated content.
     *
     * @return array
     *   A render array.
     */
    public function react()
    {
        $template_path = $this->getReactTemplatePath();
        $template = file_get_contents($template_path);

        $build = [
            'react' => [
                '#type' => 'inline_template',
                '#template' => $template,
                '#context' => $this->getReactVariables(),
            ],
        ];

        return $build;
    }

    /**
     * Variables to act as context to the twig template file.
     *
     * @return array
     *   Associative array that defines context for a template.
     */
    protected function getReactVariables()
    {
        $variables = [
            'module' => $this->getModuleName(),
        ];

        return $variables;
    }

    /**
     * Get full path to the template.
     *
     * @return string
     *   Path string.
     */
    protected function getReactTemplatePath()
    {
        return drupal_get_path('module', $this->getModuleName())."/templates/react.html.twig";
    }

    public function json()
    {
        $query = \Drupal::entityQuery('taxonomy_term');
        $query->condition('vid', "industry_types");
        $tids = $query->execute();
        $terms = \Drupal\taxonomy\Entity\Term::loadMultiple($tids);

        $term_labels = [];
        /** @var \Drupal\taxonomy\Entity\TermInterface $term */
        foreach ($terms as $tid => $term) {
            $term_labels[$tid] = $term->label();
        }

        $response['data'] = $terms;
        $response['method'] = 'GET';

        $response = new Response();
        $response->setContent(json_encode($term_labels));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

}
